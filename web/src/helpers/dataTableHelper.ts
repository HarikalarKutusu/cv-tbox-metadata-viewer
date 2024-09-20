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

export const IGNORE_VERSIONS: string[] = ["2", "5", "6.0", "16.0"];

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

  b_validated: number;
  b_invalidated: number;
  b_other: number;
  b_train: number;
  b_dev: number;
  b_test: number;
  b_reported: number;

  a_nodata: number;
  a_teens: number;
  a_twenties: number;
  a_thirties: number;
  a_fourties: number;
  a_fifties: number;
  a_sixties: number;
  a_seventies: number;
  a_eighties: number;
  a_nineties: number;

  g_nodata: number;
  g_male: number;
  g_female: number;
  g_other: number;

  reportedSentences: number;
  validatedSentences: number;
  unvalidatedSentences: number;

  sd_nodata: number;
  sd_agriculture_food: number;
  sd_automotive_transport: number;
  sd_finance: number;
  sd_service_retail: number;
  sd_general: number;
  sd_healthcare: number;
  sd_history_law_government: number;
  sd_language_fundamentals: number;
  sd_media_entertainment: number;
  sd_nature_environment: number;
  sd_news_current_affairs: number;
  sd_technology_robotics: number;

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
//== TOTALS  DataTable
//======================================

export type DELTA_ROW_TYPE = {
  version: string;
  days: number;
  locale: string;

  clips: number;
  users: number;
  totalHrs: number;
  validHrs: number;
  avgDurationSecs: number;

  b_validated: number;
  b_invalidated: number;
  b_other: number;
  b_train: number;
  b_dev: number;
  b_test: number;
  b_reported: number;

  // Calculated Values added just after importing
  validRecsPercentage: number;
  invalidRecsPercentage: number;
  otherRecsPercentage: number;
  validatedHrsPercentage: number;
  avgRecsPerUser: number;
  avgSecsPerUser: number;
  percentageUsed: number;
  malePercentage: number;
  femalePercentage: number;
  totalSentences: number;
  sentencesWithDomain: number;
};

export type DELTA_TABLE_TYPE = DELTA_ROW_TYPE[];

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
  return langRec.native_name + " (" + intl.get("lang." + langRec.name) + ")";
};

//
// Table Download
//

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
const convertArrayOfObjectsToCSV = (
  array: DT_ROW_TYPE[] | TOTALS_ROW_TYPE[] | DELTA_ROW_TYPE[],
) => {
  let result: string;

  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(array[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item: any) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];

      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
export const downloadCSV = (
  array: DT_ROW_TYPE[] | TOTALS_ROW_TYPE[] | DELTA_ROW_TYPE[],
  lcList: string[],
  verList: string[],
) => {
  const link = document.createElement("a");
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const ext: string = ".csv";
  let fn: string = "cv-metadata";
  if (lcList.length > 0) {
    lcList.forEach((lc) => (fn += "-" + lc));
  }
  if (verList.length > 0) {
    verList.forEach((ver) => (fn += "-v" + ver));
  }

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", fn + ext);
  link.click();
};
