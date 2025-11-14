export interface Margin {
  TOP: number;
  RIGHT: number;
  BOTTOM: number;
  LEFT: number;
}

export interface PlotDimensions {
  WIDTH: number;
  HEIGHT: number;
  MARGIN: Margin;
  INNER_WIDTH: number;
  INNER_HEIGHT: number;
}

export const getPlotDimensions = (
  WIDTH: number = 800,
  HEIGHT: number = 500,
  MARGIN: Margin = { TOP: 10, RIGHT: 15, BOTTOM: 45, LEFT: 55 },
): PlotDimensions => ({
  WIDTH: WIDTH,
  HEIGHT: HEIGHT,
  MARGIN: MARGIN,
  INNER_WIDTH: WIDTH - MARGIN.LEFT - MARGIN.RIGHT,
  INNER_HEIGHT: HEIGHT - MARGIN.TOP - MARGIN.BOTTOM,
});
