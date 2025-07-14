export interface ChartDimensions {
  viewBoxWidth: number;
  viewBoxHeight: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  innerWidth: number;
  innerHeight: number;
}

export interface ChartConfig {
  dimensions: ChartDimensions;
  colors: {
    gridLine: string;
    axisLine: string;
    axisText: string;
    primary: string;
    secondary: string;
    areaFill: string;
  };
  fonts: {
    axisSize: string;
    labelSize: string;
  };
}
