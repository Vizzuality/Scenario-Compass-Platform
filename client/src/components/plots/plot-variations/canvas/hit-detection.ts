import * as d3 from "d3";
import { ExtendedRun } from "@/types/data/run";
import { Scales, QuadtreePoint } from "./types";

const HIT_RADIUS = 20;

export interface SpatialIndex {
  quadtree: d3.Quadtree<QuadtreePoint>;
  searchRadius: number;
}

/** Builds the quadtree spatial index from runs + current scales. */
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
        maxSegmentLength = Math.max(maxSegmentLength, Math.hypot(x - prevX, y - prevY));
      }
    }
  });

  return {
    quadtree: d3
      .quadtree<QuadtreePoint>()
      .x((d) => d.x)
      .y((d) => d.y)
      .addAll(points),
    searchRadius: maxSegmentLength / 2 + HIT_RADIUS,
  };
};

/** Two-phase hit detection: quadtree → segment distance. */
export const findClosestRun = (
  mouseX: number,
  mouseY: number,
  runs: ExtendedRun[],
  scales: Scales,
  spatialIndex: SpatialIndex,
): ExtendedRun | null => {
  const { quadtree, searchRadius } = spatialIndex;
  const r2 = searchRadius * searchRadius;

  // Phase 1: Collect candidate run indices via quadtree
  const candidates = new Set<number>();

  quadtree.visit((node, x0, y0, x1, y1) => {
    const cx = Math.max(x0, Math.min(mouseX, x1));
    const cy = Math.max(y0, Math.min(mouseY, y1));
    if ((cx - mouseX) ** 2 + (cy - mouseY) ** 2 > r2) return true;

    if (!("length" in node)) {
      let leaf = node as d3.QuadtreeLeaf<QuadtreePoint> | undefined;
      while (leaf) {
        const d = leaf.data;
        if ((d.x - mouseX) ** 2 + (d.y - mouseY) ** 2 <= r2) {
          candidates.add(d.runIndex);
        }
        leaf = leaf.next;
      }
    }
    return false;
  });

  if (candidates.size === 0) return null;

  // Phase 2: Precise segment distance on candidates only
  let closest: ExtendedRun | null = null;
  let minDist = HIT_RADIUS;

  for (const idx of candidates) {
    const run = runs[idx];
    const pts = run.orderedPoints;

    for (let j = 0; j < pts.length - 1; j++) {
      const dist = segmentDistance(
        mouseX,
        mouseY,
        scales.xScale(pts[j].year),
        scales.yScale(pts[j].value),
        scales.xScale(pts[j + 1].year),
        scales.yScale(pts[j + 1].value),
      );
      if (dist < minDist) {
        minDist = dist;
        closest = run;
      }
      if (minDist < 2) return closest;
    }
  }

  return closest;
};

/** Shortest distance from a point to a line segment. */
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
