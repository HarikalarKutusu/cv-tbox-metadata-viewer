// i10n
import intl from "react-intl-universal";
// DataTable
import { TableColumn } from "react-data-table-component";
// APP
// import { CV_TOTALS_COLS } from "./metadataHelper";
import { PRIMARY_COLOR } from "../components/ui/theme";

// Data
import CV_LANGUAGES from "./../assets/data/$cv_languages.json";

//======================================
//== Table Styling
//======================================
export const TABLE_STYLE = {
  headRow: {
    style: {
      backgroundColor: PRIMARY_COLOR,
      // backgroundColor: "#ee9a9d",
      color: "#ffffff",
    },
  },
};

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

// TOTALS

export type TOTALS_ROW_TYPE = {
  version: string;
  date: string;
  total_locales: number;
  total_clips: number;
  total_users: number;
  total_duration: number;
  total_totalHrs: number;
  total_validHrs: number;
};

export type TOTALS_TABLE_TYPE = TOTALS_ROW_TYPE[];

// CV Languages Table from api
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

// METADATA

export function getMetaDataTableView(
  viewname: string,
  langCode: string,
): [TableColumn<DT_ROW_TYPE>[], string] {
  const dec2 = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const dec3 = { minimumFractionDigits: 3, maximumFractionDigits: 3 };

  const colVersion: TableColumn<DT_ROW_TYPE> = {
    id: "version",
    name: intl.get("col.version"),
    sortable: true,
    center: true,
    width: "100px",
    selector: (row) => row.version,
    sortFunction: (a, b) =>
      parseFloat(a.version) > parseFloat(b.version) ? 1 : -1,
  };
  // const colDate: TableColumn<DT_ROW_TYPE> = {
  //   id: "date",
  //   name: intl.get("col.date"),
  //   sortable: true,
  //   center: true,
  //   selector: (row) => row.date,
  // };
  const colLocale: TableColumn<DT_ROW_TYPE> = {
    id: "locale",
    name: intl.get("col.locale"),
    sortable: true,
    center: true,
    width: "100px",
    selector: (row) => row.locale,
  };
  const colClips: TableColumn<DT_ROW_TYPE> = {
    id: "clips",
    name: intl.get("col.clips"),
    sortable: true,
    right: true,
    selector: (row) => (row.clips ? row.clips.toLocaleString(langCode) : "-"),
    sortFunction: (a, b) => (a.clips > b.clips ? 1 : -1),
  };
  const colUsers: TableColumn<DT_ROW_TYPE> = {
    id: "users",
    name: intl.get("col.users"),
    sortable: true,
    right: true,
    selector: (row) => (row.users ? row.users.toLocaleString(langCode) : "-"),
    sortFunction: (a, b) => (a.users > b.users ? 1 : -1),
  };
  const colTotalHrs: TableColumn<DT_ROW_TYPE> = {
    id: "totalHrs",
    name: intl.get("col.totalHrs"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.totalHrs ? row.totalHrs.toLocaleString(langCode, dec2) : "-",
    sortFunction: (a, b) => (a.totalHrs > b.totalHrs ? 1 : -1),
  };
  const colValidHrs: TableColumn<DT_ROW_TYPE> = {
    id: "validHrs",
    name: intl.get("col.validHrs"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.validHrs ? row.validHrs.toLocaleString(langCode, dec2) : "-",
    sortFunction: (a, b) => (a.validHrs > b.validHrs ? 1 : -1),
  };

  // const colValidDurationSecs: TableColumn<DT_ROW_TYPE> = {
  //   id: "validDurationSecs",
  //   name: intl.get("col.validDurationSecs"),
  //   right: true,
  //   sortable: true,
  //   selector: (row) => row.validDurationSecs,
  //   cell: (row) => row.validDurationSecs.toLocaleString(langCode),
  // };
  const colAvgDurationSecs: TableColumn<DT_ROW_TYPE> = {
    id: "avgDurationSecs",
    name: intl.get("col.avgDurationSecs"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.avgDurationSecs
        ? row.avgDurationSecs.toLocaleString(langCode, dec3)
        : "-",
    sortFunction: (a, b) => (a.avgDurationSecs > b.avgDurationSecs ? 1 : -1),
  };

  const colBucketsValidated: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsValidated",
    name: intl.get("col.buckets_validated"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.buckets_validated
        ? row.buckets_validated.toLocaleString(langCode)
        : "-",
    sortFunction: (a, b) =>
      a.buckets_validated > b.buckets_validated ? 1 : -1,
  };
  const colBucketsInValidated: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsInValidated",
    name: intl.get("col.buckets_invalidated"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.buckets_invalidated
        ? row.buckets_invalidated.toLocaleString(langCode)
        : "-",
    sortFunction: (a, b) =>
      a.buckets_invalidated > b.buckets_invalidated ? 1 : -1,
  };
  const colBucketsOther: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsOther",
    name: intl.get("col.buckets_other"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.buckets_other ? row.buckets_other.toLocaleString(langCode) : "-",
    sortFunction: (a, b) => (a.buckets_other > b.buckets_other ? 1 : -1),
  };
  const colBucketsTrain: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsTrain",
    name: intl.get("col.buckets_train"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.buckets_train ? row.buckets_train.toLocaleString(langCode) : "-",
    sortFunction: (a, b) => (a.buckets_train > b.buckets_train ? 1 : -1),
  };
  const colBucketsDev: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsDev",
    name: intl.get("col.buckets_dev"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.buckets_dev ? row.buckets_dev.toLocaleString(langCode) : "-",
    sortFunction: (a, b) => (a.buckets_dev > b.buckets_dev ? 1 : -1),
  };
  const colBucketsTest: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsTest",
    name: intl.get("col.buckets_test"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.buckets_test ? row.buckets_test.toLocaleString(langCode) : "-",
    sortFunction: (a, b) => (a.buckets_test > b.buckets_test ? 1 : -1),
  };
  // const colBucketsReported: TableColumn<DT_ROW_TYPE> = {
  //   id: "bucketsReported",
  //   name: intl.get("col.buckets_reported"),
  //   sortable: true,
  //   right: true,
  //   selector: (row) => row.buckets_reported,
  //   cell: (row) => row.buckets_reported.toLocaleString(langCode),
  // };

  const colAgesNodata: TableColumn<DT_ROW_TYPE> = {
    id: "agesNodata",
    name: intl.get("col.ages_nodata"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_nodata ? row.ages_nodata : "-"),
    sortFunction: (a, b) => (a.ages_nodata > b.ages_nodata ? 1 : -1),
  };
  const colAgesTeens: TableColumn<DT_ROW_TYPE> = {
    id: "agesTeens",
    name: intl.get("col.ages_teens"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_teens ? row.ages_teens : "-"),
    sortFunction: (a, b) => (a.ages_teens > b.ages_teens ? 1 : -1),
  };
  const colAgesTwenties: TableColumn<DT_ROW_TYPE> = {
    id: "agesTwenties",
    name: intl.get("col.ages_twenties"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_twenties ? row.ages_twenties : "-"),
    sortFunction: (a, b) => (a.ages_twenties > b.ages_twenties ? 1 : -1),
  };
  const colAgesThirties: TableColumn<DT_ROW_TYPE> = {
    id: "agesThirties",
    name: intl.get("col.ages_thirties"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_thirties ? row.ages_thirties : "-"),
    sortFunction: (a, b) => (a.ages_thirties > b.ages_thirties ? 1 : -1),
  };
  const colAgesFourties: TableColumn<DT_ROW_TYPE> = {
    id: "agesFourties",
    name: intl.get("col.ages_fourties"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_fourties ? row.ages_fourties : "-"),
    sortFunction: (a, b) => (a.ages_fourties > b.ages_fourties ? 1 : -1),
  };
  const colAgesFifties: TableColumn<DT_ROW_TYPE> = {
    id: "agesFifties",
    name: intl.get("col.ages_fifties"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_fifties ? row.ages_fifties : "-"),
    sortFunction: (a, b) => (a.ages_fifties > b.ages_fifties ? 1 : -1),
  };
  const colAgesSixties: TableColumn<DT_ROW_TYPE> = {
    id: "agesSixties",
    name: intl.get("col.ages_sixties"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_sixties ? row.ages_sixties : "-"),
    sortFunction: (a, b) => (a.ages_sixties > b.ages_sixties ? 1 : -1),
  };
  const colAgesSeventies: TableColumn<DT_ROW_TYPE> = {
    id: "agesSeventies",
    name: intl.get("col.ages_seventies"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_seventies ? row.ages_seventies : "-"),
    sortFunction: (a, b) => (a.ages_seventies > b.ages_seventies ? 1 : -1),
  };
  const colAgesEighties: TableColumn<DT_ROW_TYPE> = {
    id: "agesEighties",
    name: intl.get("col.ages_eighties"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_eighties ? row.ages_eighties : "-"),
    sortFunction: (a, b) => (a.ages_eighties > b.ages_eighties ? 1 : -1),
  };
  const colAgesNineties: TableColumn<DT_ROW_TYPE> = {
    id: "agesNineties",
    name: intl.get("col.ages_nineties"),
    sortable: true,
    right: true,
    selector: (row) => (row.ages_nineties ? row.ages_nineties : "-"),
    sortFunction: (a, b) => (a.ages_nineties > b.ages_nineties ? 1 : -1),
  };

  const colGendersNodata: TableColumn<DT_ROW_TYPE> = {
    id: "gendersNodata",
    name: intl.get("col.genders_nodata"),
    sortable: true,
    right: true,
    selector: (row) => (row.genders_nodata ? row.genders_nodata : "-"),
    sortFunction: (a, b) => (a.genders_nodata > b.genders_nodata ? 1 : -1),
  };
  const colGendersMale: TableColumn<DT_ROW_TYPE> = {
    id: "gendersMale",
    name: intl.get("col.genders_male"),
    sortable: true,
    right: true,
    selector: (row) => (row.genders_male ? row.genders_male : "-"),
    sortFunction: (a, b) => (a.genders_male > b.genders_male ? 1 : -1),
  };
  const colGendersFemale: TableColumn<DT_ROW_TYPE> = {
    id: "gendersFemale",
    name: intl.get("col.genders_female"),
    sortable: true,
    right: true,
    selector: (row) => (row.genders_female ? row.genders_female : "-"),
    sortFunction: (a, b) => (a.genders_female > b.genders_female ? 1 : -1),
  };
  const colGendersOther: TableColumn<DT_ROW_TYPE> = {
    id: "gendersOther",
    name: intl.get("col.genders_other"),
    sortable: true,
    right: true,
    selector: (row) => (row.genders_other ? row.genders_other : "-"),
    sortFunction: (a, b) => (a.genders_other > b.genders_other ? 1 : -1),
  };

  const colSize: TableColumn<DT_ROW_TYPE> = {
    id: "size",
    name: intl.get("col.size"),
    sortable: true,
    right: true,
    width: "150px",
    selector: (row) => (row.size ? row.size.toLocaleString(langCode) : "-"),
    sortFunction: (a, b) => (a.size > b.size ? 1 : -1),
  };
  const colChecksum: TableColumn<DT_ROW_TYPE> = {
    id: "checksum",
    name: intl.get("col.checksum"),
    sortable: false,
    // right: true,
    selector: (row) => (row.checksum ? row.checksum : "-"),
  };

  //
  // Calculated Columns
  //
  const calcValidRecsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "validRecsPercentage",
    name: intl.get("calc.valid_recs_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.validRecsPercentage ? row.validRecsPercentage.toFixed(2) : "-",
    sortFunction: (a, b) =>
      a.validRecsPercentage! > b.validRecsPercentage! ? 1 : -1,
  };
  const calcInvalidRecsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "invalidRecsPercentage",
    name: intl.get("calc.invalid_recs_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.invalidRecsPercentage ? row.invalidRecsPercentage.toFixed(2) : "-",
    sortFunction: (a, b) =>
      a.invalidRecsPercentage! > b.invalidRecsPercentage! ? 1 : -1,
  };
  const calcOtherRecsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "otherRecsPercentage",
    name: intl.get("calc.other_recs_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.otherRecsPercentage ? row.otherRecsPercentage.toFixed(2) : "-",
    sortFunction: (a, b) =>
      a.otherRecsPercentage! > b.otherRecsPercentage! ? 1 : -1,
  };

  const calcValidHrsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "validatedHrsPercentage",
    name: intl.get("calc.valid_hrs_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.validatedHrsPercentage ? row.validatedHrsPercentage.toFixed(2) : "-",
    sortFunction: (a, b) =>
      a.validatedHrsPercentage! > b.validatedHrsPercentage! ? 1 : -1,
  };
  const calcReportedPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "reportedPercentage",
    name: intl.get("calc.reported_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.reportedPercentage ? row.reportedPercentage.toFixed(2) : "-",
    sortFunction: (a, b) =>
      a.reportedPercentage! > b.reportedPercentage! ? 1 : -1,
  };
  const calcAvgRecsPerUser: TableColumn<DT_ROW_TYPE> = {
    id: "avgRecsPerUser",
    name: intl.get("calc.avg_recs_per_user"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.avgRecsPerUser
        ? row.avgRecsPerUser.toLocaleString(langCode, dec2)
        : "-",
    sortFunction: (a, b) => (a.avgRecsPerUser! > b.avgRecsPerUser! ? 1 : -1),
  };
  const calcAvgSecsPerUser: TableColumn<DT_ROW_TYPE> = {
    id: "avgSecsPerUser",
    name: intl.get("calc.avg_secs_per_user"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.avgSecsPerUser
        ? row.avgSecsPerUser.toLocaleString(langCode, dec2)
        : "-",
    sortFunction: (a, b) => (a.avgSecsPerUser! > b.avgSecsPerUser! ? 1 : -1),
  };

  const calcPercentageUsed: TableColumn<DT_ROW_TYPE> = {
    id: "percentageUsed",
    name: intl.get("calc.percentage_used"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.percentageUsed ? row.percentageUsed.toFixed(2) : "-",
    sortFunction: (a, b) => (a.percentageUsed! > b.percentageUsed! ? 1 : -1),
  };
  const calcEstTrainHrs: TableColumn<DT_ROW_TYPE> = {
    id: "estTrainHrs",
    name: intl.get("calc.est_train_hrs"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.estTrainHrs ? row.estTrainHrs.toLocaleString(langCode, dec2) : "-",
    sortFunction: (a, b) => (a.estTrainHrs! > b.estTrainHrs! ? 1 : -1),
  };
  const calcEstDevHrs: TableColumn<DT_ROW_TYPE> = {
    id: "estDevHrs",
    name: intl.get("calc.est_dev_hrs"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.estDevHrs ? row.estDevHrs.toLocaleString(langCode, dec2) : "-",
    sortFunction: (a, b) => (a.estDevHrs! > b.estDevHrs! ? 1 : -1),
  };
  const calcEstTestHrs: TableColumn<DT_ROW_TYPE> = {
    id: "estTestHrs",
    name: intl.get("calc.est_test_hrs"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.estTestHrs ? row.estTestHrs.toLocaleString(langCode, dec2) : "-",
    sortFunction: (a, b) => (a.estTestHrs! > b.estTestHrs! ? 1 : -1),
  };

  const calcFMRatio: TableColumn<DT_ROW_TYPE> = {
    id: "fmRatio",
    name: intl.get("calc.fm_ratio"),
    sortable: true,
    right: true,
    selector: (row) => (row.fmRatio ? row.fmRatio.toFixed(2) : "-"),
    sortFunction: (a, b) => (a.fmRatio! > b.fmRatio! ? 1 : -1),
  };
  const calcMalePercentage: TableColumn<DT_ROW_TYPE> = {
    id: "malePercentage",
    name: intl.get("calc.male_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.malePercentage ? row.malePercentage.toFixed(2) : "-",
    sortFunction: (a, b) => (a.malePercentage! > b.malePercentage! ? 1 : -1),
  };
  const calcFemalePercentage: TableColumn<DT_ROW_TYPE> = {
    id: "femalePercentage",
    name: intl.get("calc.female_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      row.femalePercentage ? row.femalePercentage.toFixed(2) : "-",
    sortFunction: (a, b) =>
      a.femalePercentage! > b.femalePercentage! ? 1 : -1,
  };

  // Data from API
  const apiNativeName: TableColumn<DT_ROW_TYPE> = {
    id: "api_native_name",
    name: intl.get("api.native_name"),
    sortable: true,
    center: true,
    selector: (row) => getCVLanguageRecord(row.locale).native_name,
  };
  const apiId: TableColumn<DT_ROW_TYPE> = {
    id: "api_id",
    name: intl.get("api.id"),
    sortable: true,
    right: true,
    selector: (row) =>
      getCVLanguageRecord(row.locale).id,
  }
  const apiTargetSentenceCount: TableColumn<DT_ROW_TYPE> = {
    id: "target_sentence_count",
    name: intl.get("api.target_sentence_count"),
    sortable: true,
    right: true,
    selector: (row) =>
      getCVLanguageRecord(row.locale).target_sentence_count.toLocaleString(
        langCode,
      ),
  };

  let viewCols: TableColumn<DT_ROW_TYPE>[];
  let viewTitle: string = "";

  switch (viewname) {
    case "main":
      viewCols = [
        colVersion,
        // colDate,
        colLocale,
        apiNativeName,
        colClips,
        colUsers,
        colTotalHrs,
        colValidHrs,
        calcValidHrsPercentage,
      ];
      viewTitle = intl.get("menu.views.alldata");
      break;
    case "calculated":
      viewCols = [
        colVersion,
        // colDate,
        colLocale,
        apiNativeName,
        colAvgDurationSecs,
        calcValidHrsPercentage,
        calcInvalidRecsPercentage,
        calcReportedPercentage,
      ];
      viewTitle = intl.get("menu.views.calculated");
      break;
    // case "buckets-all":
    //   viewCols = [
    //     colVersion,
    //     colLocale,
    //     colClips,
    //     colBucketsValidated,
    //     colBucketsInValidated,
    //     colBucketsOther,
    //     colBucketsTrain,
    //     colBucketsDev,
    //     colBucketsTest,
    //     colBucketsReported,
    //   ];
    //   viewTitle = intl.get("menu.views.buckets-all");
    //   break;
    case "buckets-main":
      viewCols = [
        colVersion,
        colLocale,
        apiNativeName,
        colClips,
        colBucketsValidated,
        colBucketsInValidated,
        colBucketsOther,
        calcValidRecsPercentage,
        calcInvalidRecsPercentage,
        calcOtherRecsPercentage,
      ];
      viewTitle = intl.get("menu.views.buckets-main");
      break;
    case "buckets-model":
      viewCols = [
        colVersion,
        colLocale,
        apiNativeName,
        colBucketsTrain,
        colBucketsDev,
        colBucketsTest,
        calcEstTrainHrs,
        calcEstDevHrs,
        calcEstTestHrs,
        calcPercentageUsed,
      ];
      viewTitle = intl.get("menu.views.buckets-model");
      break;
    // case "buckets-reported":
    //   viewCols = [colVersion, colLocale, colBucketsReported];
    //   viewTitle = intl.get('menu.views.buckets-reported');
    //   break;
    // case "average-duration":
    //   viewCols = [colVersion, colLocale, colAvgDurationSecs];
    //   viewTitle = intl.get('menu.views.alldata');
    //   break;
    case "users":
      viewCols = [
        colVersion,
        colLocale,
        apiNativeName,
        colUsers,
        calcAvgRecsPerUser,
        calcAvgSecsPerUser,
        calcFMRatio,
      ];
      viewTitle = intl.get("menu.views.users");
      break;
    case "ages":
      viewCols = [
        colVersion,
        colLocale,
        apiNativeName,
        colAgesTeens,
        colAgesTwenties,
        colAgesThirties,
        colAgesFourties,
        colAgesFifties,
        colAgesSixties,
        colAgesSeventies,
        colAgesEighties,
        colAgesNineties,
        colAgesNodata,
      ];
      viewTitle = intl.get("menu.views.ages");
      break;
    case "genders":
      viewCols = [
        colVersion,
        colLocale,
        apiNativeName,
        colGendersMale,
        colGendersFemale,
        colGendersOther,
        colGendersNodata,
        calcFMRatio,
        calcMalePercentage,
        calcFemalePercentage,
      ];
      viewTitle = intl.get("menu.views.genders");
      break;
    case "other":
      viewCols = [
        colVersion,
        colLocale,
        apiNativeName,
        apiId,
        apiTargetSentenceCount,
        colSize,
        colChecksum,
      ];
      viewTitle = intl.get("menu.views.other");
      break;
    default:
      viewCols = [];
  }

  return [viewCols, viewTitle];
}

// TOTALS TABLE

export function getTotalsTableView(
  langCode: string,
): [TableColumn<TOTALS_ROW_TYPE>[], string] {
  const colVersion: TableColumn<TOTALS_ROW_TYPE> = {
    id: "version",
    name: intl.get("col.version"),
    sortable: true,
    center: true,
    width: "100px",
    selector: (row) => row.version,
    sortFunction: (a, b) => (Number(a) > Number(b) ? 1 : -1),
  };
  const colDate: TableColumn<TOTALS_ROW_TYPE> = {
    id: "date",
    name: intl.get("col.date"),
    sortable: true,
    center: true,
    selector: (row) => row.date,
  };
  const colLocale: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_locales",
    name: intl.get("col.total_locales"),
    sortable: true,
    center: true,
    // width: "100px",
    selector: (row) => row.total_locales,
  };
  const colClips: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_clips",
    name: intl.get("col.total_clips"),
    sortable: true,
    right: true,
    selector: (row) => row.total_clips,
    cell: (row) => row.total_clips.toLocaleString(langCode),
  };
  const colUsers: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_users",
    name: intl.get("col.total_users"),
    sortable: true,
    right: true,
    selector: (row) => row.total_users,
    cell: (row) => row.total_users.toLocaleString(langCode),
  };
  const colTotalHrs: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_totalHrs",
    name: intl.get("col.total_totalHrs"),
    sortable: true,
    right: true,
    selector: (row) => row.total_totalHrs,
    cell: (row) => Math.round(row.total_totalHrs).toLocaleString(langCode),
  };
  const colValidHrs: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_validHrs",
    name: intl.get("col.total_validHrs"),
    sortable: true,
    right: true,
    selector: (row) => row.total_validHrs,
    cell: (row) => Math.round(row.total_validHrs).toLocaleString(langCode),
  };

  // Calculated Columns
  const calcValidPercentage: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_validPercentage",
    name: intl.get("calc.valid_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      ((100 * row.total_validHrs) / row.total_totalHrs).toFixed(2),
  };

  let viewCols: TableColumn<TOTALS_ROW_TYPE>[];
  let viewTitle: string = "";

  viewCols = [
    colVersion,
    colDate,
    colLocale,
    colClips,
    colUsers,
    colTotalHrs,
    colValidHrs,
    calcValidPercentage,
  ];
  viewTitle = intl.get("menu.views.totals");
  // console.log(viewCols, viewTitle)
  return [viewCols, viewTitle];
}
