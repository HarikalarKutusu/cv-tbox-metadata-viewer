import { CV_METADATATABLE_TYPE, TOTALS_TABLE_TYPE } from "./dataTableHelper";

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
  {
    view: "totals",
    data: "totals",
    type: "area",
    xKey: "version",
    yKeys: ["calc_valid_percentage"],
    seriesNames: ["calc.valid_percentage"],
    title: "graph.title.cv_global_totals",
    subTitle: "calc.valid_percentage",
  },
  {
    view: "totals",
    data: "totals",
    type: "area",
    xKey: "version",
    yKeys: ["calc_avg_dur_clip"],
    seriesNames: ["calc.avg_dur_clip"],
    title: "graph.title.cv_global_totals",
    subTitle: "calc.avg_dur_clip",
  },
  {
    view: "totals",
    data: "totals",
    type: "area",
    xKey: "version",
    yKeys: ["calc_avg_dur_user"],
    seriesNames: ["calc.avg_dur_user"],
    title: "graph.title.cv_global_totals",
    subTitle: "calc.avg_dur_user",
  },
  {
    view: "totals",
    data: "totals",
    type: "area",
    xKey: "version",
    stacked: true,
    yKeys: ["calc_100minus", "calc_100_300", "calc_300_1000", "calc_1000plus"],
    seriesNames: [
      "calc.100minus",
      "calc.100_300",
      "calc.300_1000",
      "calc.1000plus",
    ],
    title: "graph.title.cv_global_totals",
    subTitle: "graph.subtitle.voice_corpus_bands",
  },
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    yKeys: ["tc_total", "tc_val", "tc_unval"],
    seriesNames: ["calc.tc.total", "col.tc.validated", "col.tc.unvalidated"],
    title: "graph.title.cv_global_totals",
    subTitle: "graph.subtitle.text_corpus_stats",
  },
  {
    view: "totals",
    data: "totals",
    type: "bar",
    xKey: "version",
    stacked: true,
    yKeys: [
      "sd_agriculture_food",
      "sd_automotive_transport",
      "sd_finance",
      "sd_service_retail",
      "sd_healthcare",
      "sd_history_law_government",
      "sd_language_fundamentals",
      "sd_media_entertainment",
      "sd_nature_environment",
      "sd_news_current_affairs",
      "sd_technology_robotics",
    ],
    seriesNames: [
      "dom.agriculture_food",
      "dom.automotive_transport",
      "dom.finance",
      "dom.service_retail",
      "dom.healthcare",
      "dom.history_law_government",
      "dom.language_fundamentals",
      "dom.media_entertainment",
      "dom.nature_environment",
      "dom.news_current_affairs",
      "dom.technology_robotics",
    ],
    title: "graph.title.cv_global_totals",
    subTitle: "graph.subtitle.sentence_domain_stats",
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
  {
    view: "textcorpus",
    data: "metadata",
    type: "bar",
    xKey: "version",
    yKeys: [
      "tc_totalSentences",
      "validatedSentences",
      "unvalidatedSentences",
    ],
    seriesNames: ["calc.tc.total", "col.tc.validated", "col.tc.unvalidated"],
    subTitle: "graph.subtitle.text_corpus_stats",
  },
  {
    view: "domains",
    data: "metadata",
    type: "bar",
    xKey: "version",
    stacked: true,
    yKeys: [
      "sd_agriculture_food",
      "sd_automotive_transport",
      "sd_finance",
      "sd_service_retail",
      "sd_healthcare",
      "sd_history_law_government",
      "sd_language_fundamentals",
      "sd_media_entertainment",
      "sd_nature_environment",
      "sd_news_current_affairs",
      "sd_technology_robotics",
    ],
    seriesNames: [
      "dom.agriculture_food",
      "dom.automotive_transport",
      "dom.finance",
      "dom.service_retail",
      "dom.healthcare",
      "dom.history_law_government",
      "dom.language_fundamentals",
      "dom.media_entertainment",
      "dom.nature_environment",
      "dom.news_current_affairs",
      "dom.technology_robotics",
    ],
    subTitle: "graph.subtitle.sentence_domain_stats",
  },
];
