import React, { useEffect, useState } from "react";
import intl from "react-intl-universal";
import { useStore } from "../stores/store";

import { DataFrame, GroupedDataFrame } from "dataframe-js";

import DataTable, {
  TableColumn,
  TableProps,
  Direction,
  Alignment,
  Media,
} from "react-data-table-component";
import { __rows__ } from "dataframe-js/symbol";

const selectProps = {
  indeterminate: (isIndeterminate: boolean) => isIndeterminate,
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
};

// const numericSort = (rows: DT_ROW_TYPE[], selector: any, direction: any) => {
//   return rows.sort ((rowA: DT_ROW_TYPE, rowB: DT_ROW_TYPE) => {
//     const a = parseFloat(rowA.version)
//     const b = parseFloat(rowA.version)
//     let res = 0;
//     if (a > b) {
//       res = 1
//     } else if (a < b) {
//       res = -1
//     }
//     return direction === 'desc' ? res * -1 : res;
//   })
// };

const numericVersionSort = (rowA: DT_ROW_TYPE, rowB: DT_ROW_TYPE) => {
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

// const localeFormattedNumber = (row: DT_ROW_TYPE)  => {

// }

export function getMetaDataTableView(viewname: string, langCode: string) {
  console.log("getMetaDataTableView");
  // const { langCode } = useStore();

  const colVersion: TableColumn<DT_ROW_TYPE> = {
    id: "version",
    name: intl.get("colnames.version"),
    sortable: true,
    center: true,
    // cell: row => row.version = parseFloat(row.version)
    selector: (row) => row.version,
    sortFunction: numericVersionSort,
  };
  const colDate: TableColumn<DT_ROW_TYPE> = {
    id: "date",
    name: intl.get("colnames.date"),
    sortable: true,
    center: true,
    selector: (row) => row.date,
  };
  const colLocale: TableColumn<DT_ROW_TYPE> = {
    id: "locale",
    name: intl.get("colnames.locale"),
    sortable: true,
    center: true,
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
    cell: (row) => row.totalHrs.toLocaleString(langCode),
  };
  const colValidHrs: TableColumn<DT_ROW_TYPE> = {
    id: "validHrs",
    name: intl.get("colnames.validHrs"),
    sortable: true,
    right: true,
    selector: (row) => row.validHrs,
    cell: (row) => row.validHrs.toLocaleString(langCode),
  };

  const colValidDurationSecs: TableColumn<DT_ROW_TYPE> = {
    id: "validDurationSecs",
    name: intl.get("colnames.validDurationSecs"),
    right: true,
    sortable: true,
    selector: (row) => row.validDurationSecs,
    cell: (row) => row.validDurationSecs.toLocaleString(langCode),
  };
  const colAvgDurationSecs: TableColumn<DT_ROW_TYPE> = {
    id: "avgDurationSecs",
    name: intl.get("colnames.avgDurationSecs"),
    sortable: true,
    right: true,
    selector: (row) => row.avgDurationSecs,
    cell: (row) => row.avgDurationSecs.toLocaleString(langCode),
  };

  const colBucketsValidated: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsValidated",
    name: intl.get("colnames.buckets_validated"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_validated,
  };
  const colBucketsInValidated: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsInValidated",
    name: intl.get("colnames.buckets_invalidated"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_invalidated,
  };
  const colBucketsOther: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsOther",
    name: intl.get("colnames.buckets_other"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_other,
  };
  const colBucketsTrain: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsTrain",
    name: intl.get("colnames.buckets_train"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_train,
  };
  const colBucketsDev: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsDev",
    name: intl.get("colnames.buckets_dev"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_dev,
  };
  const colBucketsTest: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsTest",
    name: intl.get("colnames.buckets_test"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_test,
  };
  const colBucketsReported: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsReported",
    name: intl.get("colnames.buckets_reported"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_reported,
  };

  const colAgesNodata: TableColumn<DT_ROW_TYPE> = {
    id: "agesNodata",
    name: intl.get("colnames.ages_nodata"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_nodata,
  };
  const colAgesTeens: TableColumn<DT_ROW_TYPE> = {
    id: "agesTeens",
    name: intl.get("colnames.ages_teens"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_teens,
  };
  const colAgesTwenties: TableColumn<DT_ROW_TYPE> = {
    id: "agesTwenties",
    name: intl.get("colnames.ages_twenties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_twenties,
  };
  const colAgesThirties: TableColumn<DT_ROW_TYPE> = {
    id: "agesThirties",
    name: intl.get("colnames.ages_thirties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_thirties,
  };
  const colAgesFourties: TableColumn<DT_ROW_TYPE> = {
    id: "agesFourties",
    name: intl.get("colnames.ages_fourties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_fourties,
  };
  const colAgesFifties: TableColumn<DT_ROW_TYPE> = {
    id: "agesFifties",
    name: intl.get("colnames.ages_fifties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_fifties,
  };
  const colAgesSixties: TableColumn<DT_ROW_TYPE> = {
    id: "agesSixties",
    name: intl.get("colnames.ages_sixties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_sixties,
  };
  const colAgesSeventies: TableColumn<DT_ROW_TYPE> = {
    id: "agesSeventies",
    name: intl.get("colnames.ages_seventies"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_seventies,
  };
  const colAgesEighties: TableColumn<DT_ROW_TYPE> = {
    id: "agesEighties",
    name: intl.get("colnames.ages_eighties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_eighties,
  };
  const colAgesNineties: TableColumn<DT_ROW_TYPE> = {
    id: "agesNineties",
    name: intl.get("colnames.ages_nineties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_nineties,
  };

  const colGendersNodata: TableColumn<DT_ROW_TYPE> = {
    id: "gendersNodata",
    name: intl.get("colnames.genders_nodata"),
    sortable: true,
    right: true,
    selector: (row) => row.genders_nodata,
  };
  const colGendersMale: TableColumn<DT_ROW_TYPE> = {
    id: "gendersMale",
    name: intl.get("colnames.genders_male"),
    sortable: true,
    right: true,
    selector: (row) => row.genders_male,
  };
  const colGendersFemale: TableColumn<DT_ROW_TYPE> = {
    id: "gendersFemale",
    name: intl.get("colnames.genders_female"),
    sortable: true,
    right: true,
    selector: (row) => row.genders_female,
  };
  const colGendersOther: TableColumn<DT_ROW_TYPE> = {
    id: "gendersOther",
    name: intl.get("colnames.genders_other"),
    sortable: true,
    right: true,
    selector: (row) => row.genders_other,
  };

  const colSize: TableColumn<DT_ROW_TYPE> = {
    id: "size",
    name: intl.get("colnames.size"),
    sortable: true,
    right: true,
    selector: (row) => row.size,
  };
  const colChecksum: TableColumn<DT_ROW_TYPE> = {
    id: "checksum",
    name: intl.get("colnames.checksum"),
    sortable: true,
    right: true,
    selector: (row) => row.checksum,
  };

  // Calculated Columns
  const calcValidHrsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "validatedHrsPercentage",
    name: intl.get("calculated.valid_hrs_percentage"),
    sortable: true,
    right: true,
    selector: (row) => Number(((100 * row.validHrs) / row.totalHrs).toFixed(2)),
  };
  const calcInvalidRecsPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "invalidRecsPercentage",
    name: intl.get("calculated.invalid_recs_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      Number(((100 * row.buckets_invalidated) / row.clips).toFixed(2)),
  };
  const calcReportedPercentage: TableColumn<DT_ROW_TYPE> = {
    id: "reportedPercentage",
    name: intl.get("calculated.reported_percentage"),
    sortable: true,
    right: true,
    selector: (row) =>
      Number(((100 * row.buckets_reported) / row.clips).toFixed(2)),
  };
  const calcRecsPerUser: TableColumn<DT_ROW_TYPE> = {
    id: "recsPerUser",
    name: intl.get("calculated.recs_per_user"),
    sortable: true,
    right: true,
    selector: (row) =>
      Number(((100 * row.clips) / row.users).toFixed(2)),
  };

  let res: TableColumn<DT_ROW_TYPE>[];

  switch (viewname) {
    case "main":
      res = [
        colVersion,
        colDate,
        colLocale,
        colClips,
        colUsers,
        colTotalHrs,
        colValidHrs,
        calcValidHrsPercentage,
        calcInvalidRecsPercentage,
        calcReportedPercentage,
        calcRecsPerUser,
      ];
      break;
    case "buckets-all":
      res = [
        colVersion,
        colLocale,
        colClips,
        colBucketsValidated,
        colBucketsInValidated,
        colBucketsOther,
        colBucketsTrain,
        colBucketsDev,
        colBucketsTest,
        colBucketsReported,
      ];
      break;
    case "buckets-main":
      res = [
        colVersion,
        colLocale,
        colBucketsValidated,
        colBucketsInValidated,
        colBucketsOther,
      ];
      break;
    case "buckets-model":
      res = [
        colVersion,
        colLocale,
        colBucketsTrain,
        colBucketsDev,
        colBucketsTest,
      ];
      break;
    case "buckets-reported":
      res = [colVersion, colLocale, colBucketsReported];
      break;
    case "average-duration":
      res = [colVersion, colLocale, colAvgDurationSecs];
      break;
    case "ages":
      res = [
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
      break;
    case "genders":
      res = [
        colVersion,
        colLocale,
        colGendersMale,
        colGendersFemale,
        colGendersOther,
        colGendersNodata,
      ];
      break;
    case "other":
      res = [colVersion, colLocale, colSize, colChecksum];
      break;
    default:
      res = [];
  }

  return res;
}
