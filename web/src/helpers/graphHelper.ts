import { CV_METADATATABLE_TYPE, DT_ROW_TYPE, TOTALS_TABLE_TYPE } from "./dataTableHelper";

export const GRAPH_COLORS = [
  "#4e79a7",
  "#f28e2c",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
];

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

export interface IAppChartProps {
  data: CV_METADATATABLE_TYPE | TOTALS_TABLE_TYPE;
  xKey: string;
  yKeys: string[];
  seriesNames: string[];
  stacked?: boolean;
  title?: string;
  subTitle?: string;
  fillPercent?: boolean;
  cnt: number;
}

export type GRAPH_VIEW_TYPE = {
  view: string;
  data: "totals" | "metadata";
  type: CHART_TYPES;
  stacked?: boolean;
  xKey: string;
  yKeys: string[];
  seriesNames: string[];
  title?: string;
  subTitle?: string;
  fillPercent?: boolean;
};

export const GRAPH_DATA: GRAPH_VIEW_TYPE[] = [
  // view = totals
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    yKeys: ["total_locales"],
    seriesNames: ["col.total_locales"],
    title: "graph.title.cv_global_totals",
    subTitle: "col.total_locales",
  },
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    yKeys: ["total_users"],
    seriesNames: ["col.total_users"],
    title: "graph.title.cv_global_totals",
    subTitle: "col.total_users",
  },
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    yKeys: ["total_clips"],
    seriesNames: ["col.total_clips"],
    title: "graph.title.cv_global_totals",
    subTitle: "col.total_clips",
  },
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    yKeys: ["total_totalHrs", "total_validHrs"],
    seriesNames: ["col.total_totalHrs", "col.total_validHrs"],
    title: "graph.title.cv_global_totals",
    subTitle: "graph.subtitle.total_valid_hours",
  },
  // view = main
  {
    view: "main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["clips"],
    seriesNames: ["col.clips"],
    subTitle: "col.clips",
  },
  {
    view: "main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["users"],
    seriesNames: ["col.users"],
    subTitle: "col.users",
  },
  {
    view: "main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["totalHrs", "validHrs"],
    seriesNames: ["col.totalHrs", "col.validHrs"],
    subTitle: "graph.subtitle.total_valid_hours",
  },
  {
    view: "main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["validRecsPercentage"],
    seriesNames: ["calc.valid_recs_percentage"],
    subTitle: "calc.valid_recs_percentage",
    fillPercent: true,
  },
  // view = calculated
  {
    view: "calculated",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["avgDurationSecs"],
    seriesNames: ["col.avgDurationSecs"],
    subTitle: "col.avgDurationSecs",
  },
  {
    view: "calculated",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["validatedHrsPercentage"],
    seriesNames: ["calc.valid_hrs_percentage"],
    subTitle: "calc.valid_hrs_percentage",
    fillPercent: true,
  },
  {
    view: "calculated",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["invalidRecsPercentage"],
    seriesNames: ["calc.invalid_recs_percentage"],
    subTitle: "calc.invalid_recs_percentage",
  },
  {
    view: "calculated",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["reportedPercentage"],
    seriesNames: ["calc.reported_percentage"],
    subTitle: "calc.reported_percentage",
  },
  // view = buckets-main
  {
    view: "buckets-main",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["buckets_validated", "buckets_invalidated", "buckets_other"],
    seriesNames: [
      "col.buckets_validated",
      "col.buckets_invalidated",
      "col.buckets_other",
    ],
    subTitle: "graph.subtitle.buckets_main_values",
  },
  {
    view: "buckets-main",
    data: "metadata",
    type: "area",
    stacked: true,
    xKey: "version",
    yKeys: [
      "validRecsPercentage",
      "invalidRecsPercentage",
      "otherRecsPercentage",
    ],
    seriesNames: [
      "calc.valid_recs_percentage",
      "calc.invalid_recs_percentage",
      "calc.other_recs_percentage",
    ],
    subTitle: "graph.subtitle.buckets_main_per",
    fillPercent: true,
  },
  // view = buckets-model
  {
    view: "buckets-model",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["buckets_train", "buckets_dev", "buckets_test"],
    seriesNames: ["col.buckets_train", "col.buckets_dev", "col.buckets_test"],
    subTitle: "graph.subtitle.buckets_values",
  },
  {
    view: "buckets-model",
    data: "metadata",
    type: "bar",
    stacked: true,
    xKey: "version",
    yKeys: ["estTrainHrs", "estDevHrs", "estTestHrs"],
    seriesNames: [
      "calc.est_train_hrs",
      "calc.est_dev_hrs",
      "calc.est_test_hrs",
    ],
    subTitle: "graph.subtitle.buckets_hours",
  },
  {
    view: "buckets-model",
    data: "metadata",
    type: "area",
    xKey: "version",
    yKeys: ["percentageUsed"],
    seriesNames: ["calc.percentage_used"],
    subTitle: "calc.percentage_used",
    fillPercent: true,
  },
  // view = users
  {
    view: "users",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: ["users"],
    seriesNames: ["col.users"],
    subTitle: "col.users",
  },
  {
    view: "users",
    data: "metadata",
    type: "line",
    xKey: "version",
    yKeys: ["avgRecsPerUser"],
    seriesNames: ["calc.avg_recs_per_user"],
    subTitle: "calc.avg_recs_per_user",
  },
  {
    view: "users",
    data: "metadata",
    type: "line",
    xKey: "version",
    yKeys: ["avgSecsPerUser"],
    seriesNames: ["calc.avg_secs_per_user"],
    subTitle: "calc.avg_secs_per_user",
  },
  // view = ages
  {
    view: "ages",
    data: "metadata",
    type: "bar",
    stacked: true,
    xKey: "version",
    yKeys: [
      "ages_teens",
      "ages_twenties",
      "ages_thirties",
      "ages_fourties",
      "ages_fifties",
      "ages_sixties",
      "ages_seventies",
      "ages_eighties",
      "ages_nineties",
      // "ages_nodata",
    ],
    seriesNames: [
      "col.ages_teens",
      "col.ages_twenties",
      "col.ages_thirties",
      "col.ages_fourties",
      "col.ages_fifties",
      "col.ages_sixties",
      "col.ages_seventies",
      "col.ages_eighties",
      "col.ages_nineties",
      // "col.ages_nodata",
    ],
    subTitle: "graph.subtitle.age_groups",
    fillPercent: true,
  },
  // view = genders
  {
    view: "genders",
    data: "metadata",
    type: "bar",
    stacked: true,
    xKey: "version",
    yKeys: ["genders_male", "genders_female", "genders_other"],
    seriesNames: [
      "col.genders_male",
      "col.genders_female",
      "col.genders_other",
    ],
    subTitle: "graph.subtitle.gender_groups",
    fillPercent: true,
  },
  {
    view: "genders",
    data: "metadata",
    type: "area",
    stacked: true,
    xKey: "version",
    yKeys: ["malePercentage", "femalePercentage"],
    seriesNames: ["calc.male_percentage", "calc.female_percentage"],
    subTitle: "graph.subtitle.gender_in_given",
    fillPercent: true,
  },
  {
    view: "genders",
    data: "metadata",
    type: "line",
    xKey: "version",
    yKeys: ["fmRatio"],
    seriesNames: ["calc.fm_ratio"],
    subTitle: "graph.subtitle.fm_ratio",
  },
];
