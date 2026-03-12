import * as d3 from "d3";
import { ExtendedRun } from "@/types/data/run";
import { Scales, QuadtreePoint } from "./types";

// Max distance from mouse to line segment to count as a hover
const HIT_RADIUS = 20;

export interface SpatialIndex {
  quadtree: d3.Quadtree<QuadtreePoint>;
  searchRadius: number;
}

/**
 * Builds the quadtree and computes the search radius from actual segment lengths.
 * Search radius = half the longest segment + HIT_RADIUS, so we always find
 * at least one data point on any line whose segment passes near the mouse.
 */
export const buildSpatialIndex = (runs: ExtendedRun[], scales: Scales): SpatialIndex => {
  const points: QuadtreePoint[] = [];
  let maxSegmentLength = 0;

  runs.forEach((run, runIndex) => {
    const pts = run.orderedPoints;

    for (let i = 0; i < pts.length; i++) {
      const x = scales.xScale(pts[i].year);
      const y = scales.yScale(pts[i].value);
      points.push({ x, y, runIndex });

      if (i > 0) {
        const prevX = scales.xScale(pts[i - 1].year);
        const prevY = scales.yScale(pts[i - 1].value);
        const segLen = Math.hypot(x - prevX, y - prevY);
        if (segLen > maxSegmentLength) maxSegmentLength = segLen;
      }
    }
  });

  const quadtree = d3
    .quadtree<QuadtreePoint>()
    .x((d) => d.x)
    .y((d) => d.y)
    .addAll(points);

  // Half the longest segment ensures we reach at least one endpoint,
  // plus HIT_RADIUS for the perpendicular offset
  const searchRadius = maxSegmentLength / 2 + HIT_RADIUS;

  return { quadtree, searchRadius };
};

/**
 * Two-phase hit detection:
 * 1. Quadtree search with dynamic radius → candidate run indices
 * 2. Precise perpendicular segment distance on candidates only
 */
export const findClosestRun = (
  mouseX: number,
  mouseY: number,
  runs: ExtendedRun[],
  scales: Scales,
  spatialIndex: SpatialIndex,
): ExtendedRun | null => {
  const { quadtree, searchRadius } = spatialIndex;

  // Phase 1: collect candidates within searchRadius (wide net)
  const candidates = new Set<number>();

  quadtree.visit((node, x0, y0, x1, y1) => {
    const cx = Math.max(x0, Math.min(mouseX, x1));
    const cy = Math.max(y0, Math.min(mouseY, y1));
    if (Math.hypot(cx - mouseX, cy - mouseY) > searchRadius) return true;

    if (!("length" in node)) {
      let leaf = node as d3.QuadtreeLeaf<QuadtreePoint> | undefined;
      while (leaf) {
        if (Math.hypot(leaf.data.x - mouseX, leaf.data.y - mouseY) <= searchRadius) {
          candidates.add(leaf.data.runIndex);
        }
        leaf = leaf.next;
      }
    }
    return false;
  });

  if (candidates.size === 0) return null;

  // Phase 2: precise segment distance on candidates (tight HIT_RADIUS)
  let closest: ExtendedRun | null = null;
  let minDist = Infinity;

  candidates.forEach((idx) => {
    const run = runs[idx];
    const pts = run.orderedPoints;

    for (let i = 0; i < pts.length - 1; i++) {
      const ax = scales.xScale(pts[i].year);
      const ay = scales.yScale(pts[i].value);
      const bx = scales.xScale(pts[i + 1].year);
      const by = scales.yScale(pts[i + 1].value);

      const dist = segmentDistance(mouseX, mouseY, ax, ay, bx, by);
      if (dist < minDist && dist < HIT_RADIUS) {
        minDist = dist;
        closest = run;
      }
    }
  });

  return closest;
};

/** Shortest distance from point to line segment */
const segmentDistance = (
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number => {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) return Math.hypot(px - ax, py - ay);

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};
