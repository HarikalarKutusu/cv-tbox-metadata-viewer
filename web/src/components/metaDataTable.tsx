// React
import { useCallback, useEffect, useMemo } from "react";
// i10n
import intl from "react-intl-universal";
// MUI
import AddchartIcon from "@mui/icons-material/Addchart";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

// DataTable
import DataTable, { Direction, TableColumn } from "react-data-table-component";

// App
import { useStore } from "../stores/store";
import {
  CV_METADATATABLE_TYPE,
  TOTALS_TABLE_TYPE,
  TOTALS_ROW_TYPE,
  DT_ROW_TYPE,
  TABLE_STYLE,
  getCVLanguageRecord,
  dec2,
  dec3,
} from "../helpers/dataTableHelper";
import { appDatasetAnalyzerURL } from "./../helpers/appHelper";

// Data
import METADATA_RAW from "./../assets/data/$metadata.json";

//
// Table Download
//

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
const convertArrayOfObjectsToCSV = (
  array: DT_ROW_TYPE[] | TOTALS_ROW_TYPE[],
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
const downloadCSV = (
  array: DT_ROW_TYPE[] | TOTALS_ROW_TYPE[],
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

//
// JSX
//

export type MetadataTableProps = {
  // data?: DataFrame;
  view?: string; // default: 'main'
  defaultSortField?: string;
  defaultSortAsc?: boolean;
};

export const MetadataTable = (props: MetadataTableProps) => {
  const { initDone } = useStore();
  const { langCode } = useStore();
  const { metaData, setMetaData } = useStore();
  const { setCVTotals } = useStore();
  const { tableView } = useStore();
  const { versionFilter } = useStore();
  const { languageFilter } = useStore();

  // const view = props.view ? props.view : "main";

  const getMetaDataTableView = (
    viewname: string,
    langCode: string,
  ): [TableColumn<DT_ROW_TYPE>[], string] => {
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
      width: "80px",
      selector: (row) => (row.ages_nodata ? row.ages_nodata : "-"),
      sortFunction: (a, b) => (a.ages_nodata > b.ages_nodata ? 1 : -1),
    };
    const colAgesTeens: TableColumn<DT_ROW_TYPE> = {
      id: "agesTeens",
      name: intl.get("col.ages_teens"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.ages_teens ? row.ages_teens : "-"),
      sortFunction: (a, b) => (a.ages_teens > b.ages_teens ? 1 : -1),
    };
    const colAgesTwenties: TableColumn<DT_ROW_TYPE> = {
      id: "agesTwenties",
      name: intl.get("col.ages_twenties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.ages_twenties ? row.ages_twenties : "-"),
      sortFunction: (a, b) => (a.ages_twenties > b.ages_twenties ? 1 : -1),
    };
    const colAgesThirties: TableColumn<DT_ROW_TYPE> = {
      id: "agesThirties",
      name: intl.get("col.ages_thirties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.ages_thirties ? row.ages_thirties : "-"),
      sortFunction: (a, b) => (a.ages_thirties > b.ages_thirties ? 1 : -1),
    };
    const colAgesFourties: TableColumn<DT_ROW_TYPE> = {
      id: "agesFourties",
      name: intl.get("col.ages_fourties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.ages_fourties ? row.ages_fourties : "-"),
      sortFunction: (a, b) => (a.ages_fourties > b.ages_fourties ? 1 : -1),
    };
    const colAgesFifties: TableColumn<DT_ROW_TYPE> = {
      id: "agesFifties",
      name: intl.get("col.ages_fifties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.ages_fifties ? row.ages_fifties : "-"),
      sortFunction: (a, b) => (a.ages_fifties > b.ages_fifties ? 1 : -1),
    };
    const colAgesSixties: TableColumn<DT_ROW_TYPE> = {
      id: "agesSixties",
      name: intl.get("col.ages_sixties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.ages_sixties ? row.ages_sixties : "-"),
      sortFunction: (a, b) => (a.ages_sixties > b.ages_sixties ? 1 : -1),
    };
    const colAgesSeventies: TableColumn<DT_ROW_TYPE> = {
      id: "agesSeventies",
      name: intl.get("col.ages_seventies"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.ages_seventies ? row.ages_seventies : "-"),
      sortFunction: (a, b) => (a.ages_seventies > b.ages_seventies ? 1 : -1),
    };
    const colAgesEighties: TableColumn<DT_ROW_TYPE> = {
      id: "agesEighties",
      name: intl.get("col.ages_eighties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.ages_eighties ? row.ages_eighties : "-"),
      sortFunction: (a, b) => (a.ages_eighties > b.ages_eighties ? 1 : -1),
    };
    const colAgesNineties: TableColumn<DT_ROW_TYPE> = {
      id: "agesNineties",
      name: intl.get("col.ages_nineties"),
      sortable: true,
      right: true,
      width: "80px",
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
      width: "500px",
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
        row.validatedHrsPercentage
          ? row.validatedHrsPercentage.toFixed(2)
          : "-",
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
      width: "100px",
      selector: (row) => getCVLanguageRecord(row.locale).id,
    };
    const apiTargetSentenceCount: TableColumn<DT_ROW_TYPE> = {
      id: "target_sentence_count",
      name: intl.get("api.target_sentence_count"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) =>
        getCVLanguageRecord(row.locale).target_sentence_count.toLocaleString(
          langCode,
        ),
    };

    // Icon Links

    const linkToAnalyzer: TableColumn<DT_ROW_TYPE> = {
      id: "link_to_analyzer",
      name: intl.get("calc.link_to_analyzer"),
      // sortable: true,
      // right: true,
      // width: "300px",
      button: true,
      cell: (row) => (
        <a
          href={
            appDatasetAnalyzerURL + "examine/" + row.locale + "/" + row.version
          }
          target="_blank"
          rel="noreferrer"
          style={{}}
        >
          <AddchartIcon color="secondary" />
        </a>
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
          linkToAnalyzer,
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
  };

  const [viewColumns, viewTitle] = getMetaDataTableView(tableView, langCode);

  const paginationComponentOptions = {
    rowsPerPageText: intl.get("pagination.perpage"),
    rangeSeparatorText: intl.get("pagination.rangeseparator"),
    selectAllRowsItem: true,
    selectAllRowsItemText: intl.get("pagination.selectallrows"),
  };

  const applyFilters = useCallback(
    (data: CV_METADATATABLE_TYPE) => {
      let res: CV_METADATATABLE_TYPE = data;
      if (versionFilter.length > 0) {
        res = res.filter((row) => versionFilter.includes(row.version));
      }
      if (languageFilter.length > 0) {
        res = res.filter((row) => languageFilter.includes(row.locale));
      }
      return res;
    },
    [languageFilter, versionFilter],
  );

  const calcCalculatedFields = (data: CV_METADATATABLE_TYPE) => {
    const newData: CV_METADATATABLE_TYPE = [];
    data.forEach((row) => {
      // initialize with loaded data
      // const newRow: DT_ROW_TYPE = row;
      const newRow: DT_ROW_TYPE = JSON.parse(JSON.stringify(row));
      //
      // Handle some original values (percentages)
      //
      // if (row.ages_teens)
      newRow.ages_teens = Math.floor(100 * row.ages_teens);
      // if (row.ages_twenties)
      newRow.ages_twenties = Math.floor(100 * row.ages_twenties);
      // if (row.ages_thirties)
      newRow.ages_thirties = Math.floor(100 * row.ages_thirties);
      // if (row.ages_fourties)
      newRow.ages_fourties = Math.floor(100 * row.ages_fourties);
      // if (row.ages_fifties)
      newRow.ages_fifties = Math.floor(100 * row.ages_fifties);
      // if (row.ages_sixties)
      newRow.ages_sixties = Math.floor(100 * row.ages_sixties);
      // if (row.ages_seventies)
      newRow.ages_seventies = Math.floor(100 * row.ages_seventies);
      // if (row.ages_eighties)
      newRow.ages_eighties = Math.floor(100 * row.ages_eighties);
      // if (row.ages_nineties)
      newRow.ages_nineties = Math.floor(100 * row.ages_nineties);
      // if (row.ages_nodata)
      newRow.ages_nodata = Math.floor(100 * row.ages_nodata);

      // if (row.genders_male)
      newRow.genders_male = Math.floor(100 * row.genders_male);
      // if (row.genders_female)
      newRow.genders_female = Math.floor(100 * row.genders_female);
      // if (row.genders_other)
      newRow.genders_other = Math.floor(100 * row.genders_other);
      // if (row.genders_nodata)
      newRow.genders_nodata = Math.floor(100 * row.genders_nodata);

      // if (row.size)
      newRow.size = Math.round(row.size / (1024 * 1024));

      //
      // calculated fields
      //
      if (row.clips !== 0) {
        newRow.validRecsPercentage = (100 * row.buckets_validated) / row.clips;
        newRow.invalidRecsPercentage =
          (100 * row.buckets_invalidated) / row.clips;
        newRow.otherRecsPercentage = (100 * row.buckets_other) / row.clips;
        newRow.reportedPercentage = (100 * row.buckets_reported) / row.clips;
      }
      if (row.totalHrs > 0) {
        newRow.validatedHrsPercentage = (100 * row.validHrs) / row.totalHrs;
      }
      if (row.users > 0) {
        newRow.avgRecsPerUser = row.clips / row.users;
        newRow.avgSecsPerUser = row.duration / 1000 / row.users;
      }
      if (row.buckets_validated > 0) {
        newRow.percentageUsed =
          (100 * (row.buckets_train + row.buckets_dev + row.buckets_test)) /
          row.buckets_validated;
        newRow.estTrainHrs =
          100 * row.validHrs * (row.buckets_train / row.buckets_validated);
        newRow.estDevHrs =
          100 * row.validHrs * (row.buckets_dev / row.buckets_validated);
        newRow.estTestHrs =
          100 * row.validHrs * (row.buckets_test / row.buckets_validated);
      }
      if (row.genders_male > 0)
        newRow.fmRatio = row.genders_female / row.genders_male;
      if (row.genders_nodata !== 1) {
        newRow.malePercentage =
          (100 * row.genders_male) / (1 - row.genders_nodata);
        newRow.femalePercentage =
          (100 * row.genders_female) / (1 - row.genders_nodata);
      }
      // append to result table
      newData.push(newRow);
    });
    // return new data
    return newData;
  };

  const calcCVTotals = (data: CV_METADATATABLE_TYPE) => {
    const totals: TOTALS_TABLE_TYPE = []; // This will be the returned value
    const versions = [...new Set(data.map((row) => row.version))]; // get all versions
    versions.forEach((ver) => {
      // For each version do
      const subset = data.filter((row) => row.version === ver); // get all recs for that version
      const res: TOTALS_ROW_TYPE = {
        // Init record
        version: ver,
        date: subset[0].date,
        total_locales: subset.length,
        total_clips: 0,
        total_users: 0,
        total_duration: 0,
        total_totalHrs: 0,
        total_validHrs: 0,
        calc_valid_percentage: 0,
        calc_avg_dur_clip: 0,
        calc_avg_dur_user: 0,
        calc_100minus: 0,
        calc_100_300: 0,
        calc_300_1000: 0,
        calc_1000plus: 0,
      };
      // now fill other values with reducers
      res.total_clips = subset.reduce((sum, row) => {
        return sum + row.clips;
      }, 0);
      res.total_users = subset.reduce((sum, row) => {
        return sum + row.users;
      }, 0);
      res.total_duration = subset.reduce((sum, row) => {
        return sum + row.duration;
      }, 0);
      res.total_totalHrs = subset.reduce((sum, row) => {
        return sum + row.totalHrs;
      }, 0);
      res.total_validHrs = subset.reduce((sum, row) => {
        return sum + row.validHrs;
      }, 0);
      res.calc_valid_percentage =
        (100 * res.total_validHrs) / res.total_totalHrs;
      res.calc_avg_dur_clip = (3600 * res.total_totalHrs) / res.total_clips;
      res.calc_avg_dur_user = (3600 * res.total_totalHrs) / res.total_users;

      res.calc_100minus = subset.reduce((cnt, row) => {
        return row.totalHrs < 100 ? cnt + 1 : cnt;
      }, 0);
      res.calc_100_300 = subset.reduce((cnt, row) => {
        return row.totalHrs >= 100 && row.totalHrs < 300 ? cnt + 1 : cnt;
      }, 0);
      res.calc_300_1000 = subset.reduce((cnt, row) => {
        return row.totalHrs >= 300 && row.totalHrs < 1000 ? cnt + 1 : cnt;
      }, 0);
      res.calc_1000plus = subset.reduce((cnt, row) => {
        return row.totalHrs >= 1000 ? cnt + 1 : cnt;
      }, 0);
      // put row to table
      totals.push(res);
    });
    // console.log(totals);
    return totals;
  };

  const exportCVSTotalsMemo = useMemo(
    () => (
      <DownloadForOfflineIcon
        onClick={() =>
          downloadCSV(applyFilters(metaData!), languageFilter, versionFilter)
        }
        color="secondary"
        sx={{ cursor: "grab" }}
      />
    ),
    [applyFilters, languageFilter, metaData, versionFilter],
  );

  useEffect(() => {
    // make sure data is ready
    if (!metaData) {
      const rawdata = METADATA_RAW.data as CV_METADATATABLE_TYPE;
      const calcdata = calcCalculatedFields(rawdata);
      const totals = calcCVTotals(calcdata);
      setMetaData(calcdata);
      setCVTotals(totals);
    } else {
      // console.log("!!! METADATA READY !!!");
    }
  }, [metaData, setMetaData, setCVTotals]);

  return !metaData || !initDone ? (
    <></>
  ) : (
    <DataTable
      columns={viewColumns}
      data={applyFilters(metaData)}
      progressPending={!metaData}
      responsive
      dense
      pagination
      paginationPerPage={15}
      paginationComponentOptions={paginationComponentOptions}
      direction={Direction.AUTO}
      highlightOnHover
      title={viewTitle}
      persistTableHead
      defaultSortFieldId={"version"}
      defaultSortAsc={false}
      customStyles={TABLE_STYLE}
      actions={exportCVSTotalsMemo}
    />
  );
};

// TOTALS TABLE

export const TotalsTable = () => {
  const { initDone } = useStore();
  const { langCode } = useStore();
  const { cvTotals } = useStore();

  const getTotalsTableView = (
    langCode: string,
  ): [TableColumn<TOTALS_ROW_TYPE>[], string] => {
    const colVersion: TableColumn<TOTALS_ROW_TYPE> = {
      id: "version",
      name: intl.get("col.version"),
      sortable: true,
      center: true,
      width: "80px",
      selector: (row) => row.version,
      sortFunction: (a, b) =>
        parseFloat(a.version) > parseFloat(b.version) ? 1 : -1,
    };
    const colDate: TableColumn<TOTALS_ROW_TYPE> = {
      id: "date",
      name: intl.get("col.date"),
      sortable: true,
      center: true,
      width: "100px",
      selector: (row) => row.date,
    };
    const colLocale: TableColumn<TOTALS_ROW_TYPE> = {
      id: "total_locales",
      name: intl.get("col.total_locales"),
      sortable: true,
      center: true,
      width: "80px",
      selector: (row) => row.total_locales,
    };
    const colClips: TableColumn<TOTALS_ROW_TYPE> = {
      id: "total_clips",
      name: intl.get("col.total_clips"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.total_clips,
      cell: (row) => row.total_clips.toLocaleString(langCode),
    };
    const colUsers: TableColumn<TOTALS_ROW_TYPE> = {
      id: "total_users",
      name: intl.get("col.total_users"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.total_users,
      cell: (row) => row.total_users.toLocaleString(langCode),
    };
    const colTotalHrs: TableColumn<TOTALS_ROW_TYPE> = {
      id: "total_totalHrs",
      name: intl.get("col.total_totalHrs"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.total_totalHrs,
      cell: (row) => Math.round(row.total_totalHrs).toLocaleString(langCode),
    };
    const colValidHrs: TableColumn<TOTALS_ROW_TYPE> = {
      id: "total_validHrs",
      name: intl.get("col.total_validHrs"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.total_validHrs,
      cell: (row) => Math.round(row.total_validHrs).toLocaleString(langCode),
    };

    // Calculated Columns
    const calcValidPercentage: TableColumn<TOTALS_ROW_TYPE> = {
      id: "total_validPercentage",
      name: intl.get("calc.valid_percentage"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        ((100 * row.total_validHrs) / row.total_totalHrs).toFixed(2),
    };
    const calcAvgDurClip: TableColumn<TOTALS_ROW_TYPE> = {
      id: "calc_avg_dur_clip",
      name: intl.get("calc.avg_dur_clip"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) => row.calc_avg_dur_clip.toFixed(3),
    };
    const calcAvgDurUser: TableColumn<TOTALS_ROW_TYPE> = {
      id: "calc_avg_dur_user",
      name: intl.get("calc.avg_dur_user"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) => row.calc_avg_dur_user.toLocaleString(langCode, dec2),
    };
    // voice-corpus bands
    const calc100minus: TableColumn<TOTALS_ROW_TYPE> = {
      id: "calc_100minus",
      name: intl.get("calc.100minus"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.calc_100minus,
    };
    const calc100_300: TableColumn<TOTALS_ROW_TYPE> = {
      id: "calc_100_300",
      name: intl.get("calc.100_300"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.calc_100_300,
    };
    const calc300_1000: TableColumn<TOTALS_ROW_TYPE> = {
      id: "calc_300_1000",
      name: intl.get("calc.300_1000"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.calc_300_1000,
    };
    const calc1000plus: TableColumn<TOTALS_ROW_TYPE> = {
      id: "calc_1000plus",
      name: intl.get("calc.1000plus"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.calc_1000plus,
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
      calcAvgDurClip,
      calcAvgDurUser,
      calc100minus,
      calc100_300,
      calc300_1000,
      calc1000plus,
    ];
    viewTitle = intl.get("menu.views.totals");
    // console.log(viewCols, viewTitle)
    return [viewCols, viewTitle];
  };
  const paginationComponentOptions = {
    rowsPerPageText: intl.get("pagination.perpage"),
    rangeSeparatorText: intl.get("pagination.rangeseparator"),
    selectAllRowsItem: true,
    selectAllRowsItemText: intl.get("pagination.selectallrows"),
  };

  const [viewColumns, viewTitle] = getTotalsTableView(langCode);

  const exportCVSMemo = useMemo(
    () => (
      <DownloadForOfflineIcon
        onClick={() => downloadCSV(cvTotals!, ["totals"], [])}
        color="secondary"
        sx={{ cursor: "grab" }}
      />
    ),
    [cvTotals],
  );

  return !cvTotals || !initDone ? (
    <></>
  ) : (
    <DataTable
      columns={viewColumns}
      data={cvTotals}
      progressPending={!cvTotals}
      responsive
      dense
      pagination
      paginationPerPage={20}
      paginationComponentOptions={paginationComponentOptions}
      direction={Direction.AUTO}
      highlightOnHover
      title={viewTitle}
      persistTableHead
      defaultSortFieldId={"version"}
      defaultSortAsc={false}
      customStyles={TABLE_STYLE}
      actions={exportCVSMemo}
    />
  );
};
