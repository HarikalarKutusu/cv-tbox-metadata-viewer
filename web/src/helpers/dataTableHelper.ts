// APP
import { PRIMARY_COLOR } from "../components/ui/theme";

// Data
import CV_LANGUAGES from "./../assets/data/$cv_languages.json";

//======================================
//== Table Styling
//======================================
export const TABLE_STYLE = {
  header: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
  headRow: {
    style: {
      backgroundColor: PRIMARY_COLOR,
      color: "#ffffff",
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
};

export const dec2 = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
export const dec3 = { minimumFractionDigits: 3, maximumFractionDigits: 3 };

//======================================
//== Meta  DataTable
//======================================

export type DT_ROW_TYPE = {
  version: string;
  date: string;
  locale: string;

  clips: number;
  users: number;
  duration: number;
  totalHrs: number;
  validHrs: number;
  validDurationSecs: number;
  avgDurationSecs: number;

  buckets_validated: number;
  buckets_invalidated: number;
  buckets_other: number;
  buckets_train: number;
  buckets_dev: number;
  buckets_test: number;
  buckets_reported: number;

  ages_nodata: number;
  ages_teens: number;
  ages_twenties: number;
  ages_thirties: number;
  ages_fourties: number;
  ages_fifties: number;
  ages_sixties: number;
  ages_seventies: number;
  ages_eighties: number;
  ages_nineties: number;

  genders_nodata: number;
  genders_male: number;
  genders_female: number;
  genders_other: number;

  reportedSentences: number;

  size: number;
  checksum: string;

  // Calculated Values added just after importing
  validRecsPercentage?: number;
  invalidRecsPercentage?: number;
  otherRecsPercentage?: number;
  validatedHrsPercentage?: number;
  reportedPercentage?: number;
  avgRecsPerUser?: number;
  avgSecsPerUser?: number;
  percentageUsed?: number;
  estTrainHrs?: number;
  estDevHrs?: number;
  estTestHrs?: number;
  fmRatio?: number;
  malePercentage?: number;
  femalePercentage?: number;
};

export type CV_METADATATABLE_TYPE = DT_ROW_TYPE[];

//======================================
//== TOTALS  DataTable
//======================================

export type TOTALS_ROW_TYPE = {
  version: string;
  date: string;
  total_locales: number;
  total_clips: number;
  total_users: number;
  total_duration: number;
  total_totalHrs: number;
  total_validHrs: number;
  // calculated
  calc_valid_percentage: number;
  calc_avg_dur_clip: number;
  calc_avg_dur_user: number;
  calc_100minus: number;
  calc_100_300: number;
  calc_300_1000: number;
  calc_1000plus: number;
};

export type TOTALS_TABLE_TYPE = TOTALS_ROW_TYPE[];

//======================================
//== CV Languages Table from api
//======================================

export type CV_LANGUAGE_ROW = {
  id: number;
  name: string;
  target_sentence_count: number;
  native_name: string;
  is_contributable: number;
  is_translated: number;
  text_direction: string;
};

// CV LANGUAGES (API data)

export const getCVLanguageRecord = (lc: string): CV_LANGUAGE_ROW => {
  return (CV_LANGUAGES as CV_LANGUAGE_ROW[]).filter(
    (row) => row.name === lc,
  )[0];
};
