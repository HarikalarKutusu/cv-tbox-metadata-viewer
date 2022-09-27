// export const GRAPH_VIEWS_TYPE = 'days' || 'versions';

export const GRAPH_COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c"];

export type CHART_TYPES =
  | "area"
  | "bar"
  | "line"
  | "composed"
  | "pie"
  | "radar"
  | "radialbar"
  | "scatter"
  | "funnel";

export type GRAPH_VIEW_TYPE = {
  view: string,
  data: "totals" | "metadata";
  type: CHART_TYPES;
  xKey: string;
  yKeys: string[];
  seriesNames: string[];
};

export const GRAPH_DATA: GRAPH_VIEW_TYPE[] = [
  // view = totals
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    yKeys: ["total_locales"],
    seriesNames: ["colnames.total_locales"],
  },
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    yKeys: ["total_users"],
    seriesNames: ["colnames.total_users"],
  },
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    yKeys: ["total_clips"],
    seriesNames: ["colnames.total_clips"],
  },
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    yKeys: ["total_totalHrs", "total_validHrs"],
    seriesNames: ["colnames.total_totalHrs", "colnames.total_validHrs"],
  },
  // view = main
  {
    view: "main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["clips"],
    seriesNames: ["colnames.clips"],
  },
  {
    view: "main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["users"],
    seriesNames: ["colnames.users"],
  },
  {
    view: "main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["totalHrs", "validHrs"],
    seriesNames: ["colnames.totalHrs", "colnames.validHrs"],
  },
];
