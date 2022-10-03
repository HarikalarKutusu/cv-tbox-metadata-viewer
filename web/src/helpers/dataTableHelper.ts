// i10n
import intl from "react-intl-universal";
// DataTable
import { TableColumn } from "react-data-table-component";
// APP
// import { CV_TOTALS_COLS } from "./metadataHelper";

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

// NUMERIC SORTER COMMON TO METADATA AND TOTALS

const numericVersionSort = (
  rowA: DT_ROW_TYPE | TOTALS_ROW_TYPE,
  rowB: DT_ROW_TYPE | TOTALS_ROW_TYPE,
) => {
  const a = parseFloat(rowA.version);
  const b = parseFloat(rowB.version);
  let res = 0;
  if (a > b) {
    res = 1;
  } else if (a < b) {
    res = -1;
  }
  return res;
};

// METADATA

export function getMetaDataTableView(
  viewname: string,
  langCode: string,
): [TableColumn<DT_ROW_TYPE>[], string] {
  const colVersion: TableColumn<DT_ROW_TYPE> = {
    id: "version",
    name: intl.get("colnames.version"),
    sortable: true,
    center: true,
    width: "100px",
    selector: (row) => row.version,
    sortFunction: numericVersionSort,
  };
  // const colDate: TableColumn<DT_ROW_TYPE> = {
  //   id: "date",
  //   name: intl.get("colnames.date"),
  //   sortable: true,
  //   center: true,
  //   selector: (row) => row.date,
  // };
  const colLocale: TableColumn<DT_ROW_TYPE> = {
    id: "locale",
    name: intl.get("colnames.locale"),
    sortable: true,
    center: true,
    width: "100px",
    selector: (row) => row.locale,
  };
  const colClips: TableColumn<DT_ROW_TYPE> = {
    id: "clips",
    name: intl.get("colnames.clips"),
    sortable: true,
    right: true,
    selector: (row) => row.clips,
    cell: (row) => row.clips.toLocaleString(langCode),
  };
  const colUsers: TableColumn<DT_ROW_TYPE> = {
    id: "users",
    name: intl.get("colnames.users"),
    sortable: true,
    right: true,
    selector: (row) => row.users,
    cell: (row) => row.users.toLocaleString(langCode),
  };
  const colTotalHrs: TableColumn<DT_ROW_TYPE> = {
    id: "totalHrs",
    name: intl.get("colnames.totalHrs"),
    sortable: true,
    right: true,
    selector: (row) => row.totalHrs,
    cell: (row) =>
      row.totalHrs.toLocaleString(langCode, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  };
  const colValidHrs: TableColumn<DT_ROW_TYPE> = {
    id: "validHrs",
    name: intl.get("colnames.validHrs"),
    sortable: true,
    right: true,
    selector: (row) => row.validHrs,
    cell: (row) =>
      row.validHrs.toLocaleString(langCode, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  };

  // const colValidDurationSecs: TableColumn<DT_ROW_TYPE> = {
  //   id: "validDurationSecs",
  //   name: intl.get("colnames.validDurationSecs"),
  //   right: true,
  //   sortable: true,
  //   selector: (row) => row.validDurationSecs,
  //   cell: (row) => row.validDurationSecs.toLocaleString(langCode),
  // };
  const colAvgDurationSecs: TableColumn<DT_ROW_TYPE> = {
    id: "avgDurationSecs",
    name: intl.get("colnames.avgDurationSecs"),
    sortable: true,
    right: true,
    selector: (row) => Number(row.avgDurationSecs),
    cell: (row) =>
      row.avgDurationSecs.toLocaleString(langCode, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
  };

  const colBucketsValidated: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsValidated",
    name: intl.get("colnames.buckets_validated"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_validated,
    cell: (row) => row.buckets_validated.toLocaleString(langCode),
  };
  const colBucketsInValidated: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsInValidated",
    name: intl.get("colnames.buckets_invalidated"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_invalidated,
    cell: (row) => row.buckets_invalidated.toLocaleString(langCode),
  };
  const colBucketsOther: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsOther",
    name: intl.get("colnames.buckets_other"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_other,
    cell: (row) => row.buckets_other.toLocaleString(langCode),
  };
  const colBucketsTrain: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsTrain",
    name: intl.get("colnames.buckets_train"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_train,
    cell: (row) => row.buckets_train.toLocaleString(langCode),
  };
  const colBucketsDev: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsDev",
    name: intl.get("colnames.buckets_dev"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_dev,
    cell: (row) => row.buckets_dev.toLocaleString(langCode),
  };
  const colBucketsTest: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsTest",
    name: intl.get("colnames.buckets_test"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_test,
    cell: (row) => row.buckets_test.toLocaleString(langCode),
  };
  // const colBucketsReported: TableColumn<DT_ROW_TYPE> = {
  //   id: "bucketsReported",
  //   name: intl.get("colnames.buckets_reported"),
  //   sortable: true,
  //   right: true,
  //   selector: (row) => row.buckets_reported,
  //   cell: (row) => row.buckets_reported.toLocaleString(langCode),
  // };

  const colAgesNodata: TableColumn<DT_ROW_TYPE> = {
    id: "agesNodata",
    name: intl.get("colnames.ages_nodata"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_nodata).toFixed(2)),
  };
  const colAgesTeens: TableColumn<DT_ROW_TYPE> = {
    id: "agesTeens",
    name: intl.get("colnames.ages_teens"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_teens).toFixed(2)),
  };
  const colAgesTwenties: TableColumn<DT_ROW_TYPE> = {
    id: "agesTwenties",
    name: intl.get("colnames.ages_twenties"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_twenties).toFixed(2)),
  };
  const colAgesThirties: TableColumn<DT_ROW_TYPE> = {
    id: "agesThirties",
    name: intl.get("colnames.ages_thirties"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_thirties).toFixed(2)),
  };
  const colAgesFourties: TableColumn<DT_ROW_TYPE> = {
    id: "agesFourties",
    name: intl.get("colnames.ages_fourties"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_fourties).toFixed(2)),
  };
  const colAgesFifties: TableColumn<DT_ROW_TYPE> = {
    id: "agesFifties",
    name: intl.get("colnames.ages_fifties"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_fifties).toFixed(2)),
  };
  const colAgesSixties: TableColumn<DT_ROW_TYPE> = {
    id: "agesSixties",
    name: intl.get("colnames.ages_sixties"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_sixties).toFixed(2)),
  };
  const colAgesSeventies: TableColumn<DT_ROW_TYPE> = {
    id: "agesSeventies",
    name: intl.get("colnames.ages_seventies"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_seventies).toFixed(2)),
  };
  const colAgesEighties: TableColumn<DT_ROW_TYPE> = {
    id: "agesEighties",
    name: intl.get("colnames.ages_eighties"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_eighties).toFixed(2)),
  };
  const colAgesNineties: TableColumn<DT_ROW_TYPE> = {
    id: "agesNineties",
    name: intl.get("colnames.ages_nineties"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.ages_nineties).toFixed(2)),
  };

  const colGendersNodata: TableColumn<DT_ROW_TYPE> = {
    id: "gendersNodata",
    name: intl.get("colnames.genders_nodata"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.genders_nodata).toFixed(2)),
  };
  const colGendersMale: TableColumn<DT_ROW_TYPE> = {
    id: "gendersMale",
    name: intl.get("colnames.genders_male"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.genders_male).toFixed(2)),
  };
  const colGendersFemale: TableColumn<DT_ROW_TYPE> = {
    id: "gendersFemale",
    name: intl.get("colnames.genders_female"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.genders_female).toFixed(2)),
  };
  const colGendersOther: TableColumn<DT_ROW_TYPE> = {
    id: "gendersOther",
    name: intl.get("colnames.genders_other"),
    sortable: true,
    right: true,
    selector: (row) => Number((100 * row.genders_other).toFixed(2)),
  };

  const colSize: TableColumn<DT_ROW_TYPE> = {
    id: "size",
    name: intl.get("colnames.size"),
    sortable: true,
    right: true,
    width: "150px",
    selector: (row) => Number((row.size / 1024 / 1024).toFixed(0)),
    cell: (row) =>
      Number((row.size / 1024 / 1024).toFixed(0)).toLocaleString(langCode),
  };
  const colChecksum: TableColumn<DT_ROW_TYPE> = {
    id: "checksum",
    name: intl.get("colnames.checksum"),
    sortable: false,
    // right: true,
    selector: (row) => row.checksum,
  };

  // Calculated Columns
  const calcValidRecsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "validRecsPercentage",
    name: intl.get("calculated.valid_recs_percentage"),
    sortable: true,
    right: true,
    selector: (row) => row.validRecsPercentage!,
    cell: (row) => row.validRecsPercentage!.toFixed(2),
    // selector: (row) =>
    //   Number(((100 * row.buckets_validated) / row.clips).toFixed(2)),
  };
  const calcInvalidRecsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "invalidRecsPercentage",
    name: intl.get("calculated.invalid_recs_percentage"),
    sortable: true,
    right: true,
    selector: (row) => row.invalidRecsPercentage!,
    cell: (row) => row.invalidRecsPercentage!.toFixed(2),
    // selector: (row) =>
    //   Number(((100 * row.buckets_invalidated) / row.clips).toFixed(2)),
  };
  const calcOtherRecsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "otherRecsPercentage",
    name: intl.get("calculated.other_recs_percentage"),
    sortable: true,
    right: true,
    selector: (row) => row.otherRecsPercentage!,
    cell: (row) => row.otherRecsPercentage!.toFixed(2),
    // selector: (row) =>
    //   Number(((100 * row.buckets_other) / row.clips).toFixed(2)),
  };

  const calcValidHrsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "validatedHrsPercentage",
    name: intl.get("calculated.valid_hrs_percentage"),
    sortable: true,
    right: true,
    selector: (row) => row.validatedHrsPercentage!,
    cell: (row) => row.validatedHrsPercentage!.toFixed(2),
    // selector: (row) => Number(((100 * row.validHrs) / row.totalHrs).toFixed(2)),
  };
  const calcReportedPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "reportedPercentage",
    name: intl.get("calculated.reported_percentage"),
    sortable: true,
    right: true,
    selector: (row) => row.reportedPercentage!,
    cell: (row) => row.reportedPercentage!.toFixed(2),
    // selector: (row) =>
    //   Number(((100 * row.buckets_reported) / row.clips).toFixed(2)),
  };
  const calcAvgRecsPerUser: TableColumn<DT_ROW_TYPE> = {
    id: "avgRecsPerUser",
    name: intl.get("calculated.avg_recs_per_user"),
    sortable: true,
    right: true,
    selector: (row) => row.avgRecsPerUser!,
    cell: (row) => row.avgRecsPerUser!.toFixed(2),
    // selector: (row) => Number((row.clips / row.users).toFixed(2)),
  };
  const calcAvgSecsPerUser: TableColumn<DT_ROW_TYPE> = {
    id: "avgSecsPerUser",
    name: intl.get("calculated.avg_secs_per_user"),
    sortable: true,
    right: true,
    selector: (row) => row.avgSecsPerUser!,
    cell: (row) => row.avgSecsPerUser!.toFixed(2),
    // selector: (row) => (row.duration / row.users / 1000).toFixed(2),
  };

  const calcPercentageUsed: TableColumn<DT_ROW_TYPE> = {
    id: "percentageUsed",
    name: intl.get("calculated.percentage_used"),
    sortable: true,
    right: true,
    selector: (row) => row.percentageUsed!,
    cell: (row) => row.percentageUsed!.toFixed(2),
    // selector: (row) =>
    //   Number(100 * ((row.buckets_train + row.buckets_dev + row.buckets_test) / row.buckets_validated)).toFixed(2),
  };
  const calcEstTrainHrs: TableColumn<DT_ROW_TYPE> = {
    id: "estTrainHrs",
    name: intl.get("calculated.est_train_hrs"),
    sortable: true,
    right: true,
    selector: (row) => row.estTrainHrs!,
    cell: (row) => row.estTrainHrs!.toFixed(2),
    // selector: (row) =>
    //   ((row.validHrs * row.buckets_train) / row.buckets_validated).toFixed(2),
  };
  const calcEstDevHrs: TableColumn<DT_ROW_TYPE> = {
    id: "estDevHrs",
    name: intl.get("calculated.est_dev_hrs"),
    sortable: true,
    right: true,
    selector: (row) => row.estDevHrs!,
    cell: (row) => row.estDevHrs!.toFixed(2),
    // selector: (row) =>
    //   ((row.validHrs * row.buckets_dev) / row.buckets_validated).toFixed(2),
  };
  const calcEstTestHrs: TableColumn<DT_ROW_TYPE> = {
    id: "estTestHrs",
    name: intl.get("calculated.est_test_hrs"),
    sortable: true,
    right: true,
    selector: (row) => row.estTestHrs!,
    cell: (row) => row.estTestHrs!.toFixed(2),
    // selector: (row) =>
    //   ((row.validHrs * row.buckets_test) / row.buckets_validated).toFixed(2),
  };

  const calcFMRatio: TableColumn<DT_ROW_TYPE> = {
    id: "fmRatio",
    name: intl.get("calculated.fm_ratio"),
    sortable: true,
    right: true,
    selector: (row) => row.fmRatio!,
    cell: (row) => row.fmRatio!.toFixed(2),
    // selector: (row) =>
    //   Number((row.genders_female / row.genders_male).toFixed(2)),
  };
  const calcMalePercentage: TableColumn<DT_ROW_TYPE> = {
    id: "malePercentage",
    name: intl.get("calculated.male_percentage"),
    sortable: true,
    right: true,
    selector: (row) => row.malePercentage!,
    cell: (row) => row.malePercentage!.toFixed(2),
    // selector: (row) =>
    //   Number(((100 * row.genders_male) / (1 - row.genders_nodata)).toFixed(2)),
  };
  const calcFemalePercentage: TableColumn<DT_ROW_TYPE> = {
    id: "femalePercentage",
    name: intl.get("calculated.female_percentage"),
    sortable: true,
    right: true,
    selector: (row) => row.femalePercentage!,
    cell: (row) => row.femalePercentage!.toFixed(2),
    // selector: (row) =>
    //   Number(
    //     ((100 * row.genders_female) / (1 - row.genders_nodata)).toFixed(2),
    //   ),
  };

  let viewCols: TableColumn<DT_ROW_TYPE>[];
  let viewTitle: string = "";

  switch (viewname) {
    case "main":
      viewCols = [
        colVersion,
        // colDate,
        colLocale,
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
      viewCols = [colVersion, colLocale, colSize, colChecksum];
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
    name: intl.get("colnames.version"),
    sortable: true,
    center: true,
    width: "100px",
    selector: (row) => row.version,
    sortFunction: numericVersionSort,
  };
  const colDate: TableColumn<TOTALS_ROW_TYPE> = {
    id: "date",
    name: intl.get("colnames.date"),
    sortable: true,
    center: true,
    selector: (row) => row.date,
  };
  const colLocale: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_locales",
    name: intl.get("colnames.total_locales"),
    sortable: true,
    center: true,
    // width: "100px",
    selector: (row) => row.total_locales,
  };
  const colClips: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_clips",
    name: intl.get("colnames.total_clips"),
    sortable: true,
    right: true,
    selector: (row) => row.total_clips,
    cell: (row) => row.total_clips.toLocaleString(langCode),
  };
  const colUsers: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_users",
    name: intl.get("colnames.total_users"),
    sortable: true,
    right: true,
    selector: (row) => row.total_users,
    cell: (row) => row.total_users.toLocaleString(langCode),
  };
  const colTotalHrs: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_totalHrs",
    name: intl.get("colnames.total_totalHrs"),
    sortable: true,
    right: true,
    selector: (row) => row.total_totalHrs,
    cell: (row) => Math.round(row.total_totalHrs).toLocaleString(langCode),
  };
  const colValidHrs: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_validHrs",
    name: intl.get("colnames.total_validHrs"),
    sortable: true,
    right: true,
    selector: (row) => row.total_validHrs,
    cell: (row) => Math.round(row.total_validHrs).toLocaleString(langCode),
  };

  // Calculated Columns
  const calcValidPercentage: TableColumn<TOTALS_ROW_TYPE> = {
    id: "total_validPercentage",
    name: intl.get("calculated.valid_percentage"),
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
