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
  view: string;
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
  {
    view: "main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["validRecsPercentage"],
    seriesNames: ["calculated.valid_recs_percentage"],
  },
  // view = calculated
  {
    view: "calculated",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["avgDurationSecs"],
    seriesNames: ["colnames.avgDurationSecs"],
  },
  {
    view: "calculated",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["validatedHrsPercentage"],
    seriesNames: ["calculated.valid_hrs_percentage"],
  },
  {
    view: "calculated",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["invalidRecsPercentage"],
    seriesNames: ["calculated.invalid_recs_percentage"],
  },
  {
    view: "calculated",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["reportedPercentage"],
    seriesNames: ["calculated.reported_percentage"],
  },
  // view = buckets-main
  {
    view: "buckets-main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["buckets_validated", "buckets_invalidated", "buckets_other"],
    seriesNames: [
      "colnames.buckets_validated",
      "colnames.buckets_invalidated",
      "colnames.buckets_other",
    ],
  },
  {
    view: "buckets-main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: [
      "validRecsPercentage",
      "invalidRecsPercentage",
      "otherRecsPercentage",
    ],
    seriesNames: [
      "calculated.valid_recs_percentage",
      "calculated.invalid_recs_percentage",
      "calculated.other_recs_percentage",
    ],
  },
  // view = buckets-model
  {
    view: "buckets-model",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["buckets_train", "buckets_dev", "buckets_test"],
    seriesNames: [
      "colnames.buckets_train",
      "colnames.buckets_dev",
      "colnames.buckets_test",
    ],
  },
  {
    view: "buckets-model",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["estTrainHrs", "estDevHrs", "estTestHrs"],
    seriesNames: [
      "calculated.est_train_hrs",
      "calculated.est_dev_hrs",
      "calculated.est_test_hrs",
    ],
  },
  {
    view: "buckets-model",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["percentageUsed"],
    seriesNames: ["calculated.percentage_used"],
  },
  // view = users
  {
    view: "users",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["users"],
    seriesNames: ["colnames.users"],
  },
  {
    view: "users",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["avgRecsPerUser"],
    seriesNames: ["calculated.avg_recs_per_user"],
  },
  {
    view: "users",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["avgSecsPerUser"],
    seriesNames: ["calculated.avg_secs_per_user"],
  },
];
