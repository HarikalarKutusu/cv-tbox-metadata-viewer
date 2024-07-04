// i10n
import intl from "react-intl-universal";
// APP
import { PRIMARY_COLOR } from "../components/ui/theme";

// Data
import CV_LANGUAGES_RAW from "./../assets/data/$cv_languages.json";

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

export const IGNORE_VERSIONS: string[] = ["2", "5", "6.0", "16.0"]

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
  validatedSentences: number;
  unvalidatedSentences: number;

  sentence_domain_nodata: number;
  sentence_domain_agriculture_food: number;
  sentence_domain_automotive_transport: number;
  sentence_domain_finance: number;
  sentence_domain_service_retail: number;
  sentence_domain_general: number;
  sentence_domain_healthcare: number;
  sentence_domain_history_law_government: number;
  sentence_domain_language_fundamentals: number;
  sentence_domain_media_entertainment: number;
  sentence_domain_nature_environment: number;
  sentence_domain_news_current_affairs: number;
  sentence_domain_technology_robotics: number;

  size: number;
  checksum: string;

  // Calculated Values added just after importing
  validRecsPercentage?: number;
  invalidRecsPercentage?: number;
  otherRecsPercentage?: number;
  validatedHrsPercentage?: number;
  avgRecsPerUser?: number;
  avgSecsPerUser?: number;
  percentageUsed?: number;
  estTrainHrs?: number;
  estDevHrs?: number;
  estTestHrs?: number;
  fmRatio?: number;
  malePercentage?: number;
  femalePercentage?: number;
  totalSentences?: number;
  validSentencePercentage?: number;
  sentencesWithDomain?: number;
  sentencesWithDomainPercentage?: number;
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
  // text corpus
  tc_total: number;
  tc_val: number;
  tc_unval: number;
  tc_val_percentage: number;
  tc_with_domain: number;
  tc_domain_percentage: number;
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
  return (CV_LANGUAGES_RAW.data as CV_LANGUAGE_ROW[]).filter(
    (row) => row.name === lc,
  )[0];
};

export const getCVLanguageText = (lc: string): string => {
  const langRec = getCVLanguageRecord(lc);
  return langRec.native_name + " (" +  intl.get("lang." + langRec.name) + ")";
};
