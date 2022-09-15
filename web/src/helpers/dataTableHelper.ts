import React, { useEffect, useState } from "react";
import intl from "react-intl-universal";

import { DataFrame, GroupedDataFrame } from "dataframe-js";

import DataTable, {
  TableColumn,
  TableProps,
  Direction,
  Alignment,
  Media,
} from "react-data-table-component";

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


export function getMetaDataTableView(viewname: string) {
  console.log("getMetaDataTableView");

  const colVersion: TableColumn<DT_ROW_TYPE> = {
    id: "version",
    name: intl.get("colnames.version"),
    sortable: true,
    center: true,
    selector: (row) => row.version,
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
  };
  const colUsers: TableColumn<DT_ROW_TYPE> = {
    id: "users",
    name: intl.get("colnames.users"),
    sortable: true,
    right: true,
    selector: (row) => row.users,
  };
  const colTotalHrs: TableColumn<DT_ROW_TYPE> = {
    id: "totalHrs",
    name: intl.get("colnames.totalHrs"),
    sortable: true,
    right: true,
    selector: (row) => row.totalHrs,
  };
  const colValidHrs: TableColumn<DT_ROW_TYPE> = {
    id: "validHrs",
    name: intl.get("colnames.validHrs"),
    sortable: true,
    right: true,
    selector: (row) => row.validHrs,
  };

  const colValidDurationSecs: TableColumn<DT_ROW_TYPE> = {
    id: "validDurationSecs",
    name: intl.get("colnames.validDurationSecs"),
    right: true,
    sortable: true,
    selector: (row) => row.validDurationSecs,
  };
  const colAvgDurationSecs: TableColumn<DT_ROW_TYPE> = {
    id: "avgDurationSecs",
    name: intl.get("colnames.avgDurationSecs"),
    sortable: true,
    right: true,
    selector: (row) => row.avgDurationSecs,
  };

  const colBucketsValidated: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsValidated",
    name: intl.get("colnames.bucketsValidated"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_validated,
  };
  const colBucketsInValidated: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsInValidated",
    name: intl.get("colnames.bucketsInValidated"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_invalidated,
  };
  const colBucketsOther: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsOther",
    name: intl.get("colnames.bucketsOther"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_other,
  };
  const colBucketsTrain: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsTrain",
    name: intl.get("colnames.bucketsTrain"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_train,
  };
  const colBucketsDev: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsDev",
    name: intl.get("colnames.bucketsDev"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_dev,
  };
  const colBucketsTest: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsTest",
    name: intl.get("colnames.bucketsTest"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_test,
  };
  const colBucketsReported: TableColumn<DT_ROW_TYPE> = {
    id: "bucketsReported",
    name: intl.get("colnames.bucketsReported"),
    sortable: true,
    right: true,
    selector: (row) => row.buckets_reported,
  };

  const colAgesNodata: TableColumn<DT_ROW_TYPE> = {
    id: "agesNodata",
    name: intl.get("colnames.agesNodata"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_nodata,
  };
  const colAgesTeens: TableColumn<DT_ROW_TYPE> = {
    id: "agesTeens",
    name: intl.get("colnames.agesTeens"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_teens,
  };
  const colAgesTwenties: TableColumn<DT_ROW_TYPE> = {
    id: "agesTwenties",
    name: intl.get("colnames.agesTwenties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_twenties,
  };
  const colAgesThirties: TableColumn<DT_ROW_TYPE> = {
    id: "agesThirties",
    name: intl.get("colnames.agesThirties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_thirties,
  };
  const colAgesFourties: TableColumn<DT_ROW_TYPE> = {
    id: "agesFourties",
    name: intl.get("colnames.agesFourties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_fourties,
  };
  const colAgesFifties: TableColumn<DT_ROW_TYPE> = {
    id: "agesFifties",
    name: intl.get("colnames.agesFifties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_fifties,
  };
  const colAgesSixties: TableColumn<DT_ROW_TYPE> = {
    id: "agesSixties",
    name: intl.get("colnames.agesSixties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_sixties,
  };
  const colAgesSeventies: TableColumn<DT_ROW_TYPE> = {
    id: "agesSeventies",
    name: intl.get("colnames.agesSeventies"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_seventies,
  };
  const colAgesEighties: TableColumn<DT_ROW_TYPE> = {
    id: "agesEighties",
    name: intl.get("colnames.agesEighties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_eighties,
  };
  const colAgesNineties: TableColumn<DT_ROW_TYPE> = {
    id: "agesNineties",
    name: intl.get("colnames.agesNineties"),
    sortable: true,
    right: true,
    selector: (row) => row.ages_nineties,
  };


  let res: TableColumn<DT_ROW_TYPE>[];

  switch (viewname) {
    case 'main':
      res = [
        colVersion,
        colDate,
        colLocale,
        colClips,
        colUsers,
        colTotalHrs,
        colValidHrs,
      ];
      break
    case 'buckets-all':
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
      break
    case 'buckets-main':
      res = [
        colVersion,
        colLocale,
        colBucketsValidated,
        colBucketsInValidated,
        colBucketsOther,
      ];
      break
    case 'buckets-model':
      res = [
        colVersion,
        colLocale,
        colBucketsTrain,
        colBucketsDev,
        colBucketsTest,
      ];
      break
    case 'buckets-reported':
      res = [
        colVersion,
        colLocale,
        colBucketsReported,
      ];
      break
    case 'ages':
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
      ];
      break
    default:
      res = []
  }
          
  return res
}
