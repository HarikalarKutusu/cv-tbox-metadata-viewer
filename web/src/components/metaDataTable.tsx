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
  IGNORE_VERSIONS,
  getCVLanguageRecord,
  getCVLanguageText,
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
      name: intl.get("col.b_validated"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_validated
          ? row.b_validated.toLocaleString(langCode)
          : "-",
      sortFunction: (a, b) =>
        a.b_validated > b.b_validated ? 1 : -1,
    };
    const colBucketsInValidated: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsInValidated",
      name: intl.get("col.b_invalidated"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_invalidated
          ? row.b_invalidated.toLocaleString(langCode)
          : "-",
      sortFunction: (a, b) =>
        a.b_invalidated > b.b_invalidated ? 1 : -1,
    };
    const colBucketsOther: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsOther",
      name: intl.get("col.b_other"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_other ? row.b_other.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.b_other > b.b_other ? 1 : -1),
    };
    const colBucketsTrain: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsTrain",
      name: intl.get("col.b_train"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_train ? row.b_train.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.b_train > b.b_train ? 1 : -1),
    };
    const colBucketsDev: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsDev",
      name: intl.get("col.b_dev"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_dev ? row.b_dev.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.b_dev > b.b_dev ? 1 : -1),
    };
    const colBucketsTest: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsTest",
      name: intl.get("col.b_test"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_test ? row.b_test.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.b_test > b.b_test ? 1 : -1),
    };
    // const colBucketsReported: TableColumn<DT_ROW_TYPE> = {
    //   id: "bucketsReported",
    //   name: intl.get("col.b_reported"),
    //   sortable: true,
    //   right: true,
    //   selector: (row) => row.b_reported,
    //   cell: (row) => row.b_reported.toLocaleString(langCode),
    // };

    const colAgesNodata: TableColumn<DT_ROW_TYPE> = {
      id: "agesNodata",
      name: intl.get("col.a_nodata"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_nodata ? row.a_nodata : "-"),
      sortFunction: (a, b) => (a.a_nodata > b.a_nodata ? 1 : -1),
    };
    const colAgesTeens: TableColumn<DT_ROW_TYPE> = {
      id: "agesTeens",
      name: intl.get("col.a_teens"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_teens ? row.a_teens : "-"),
      sortFunction: (a, b) => (a.a_teens > b.a_teens ? 1 : -1),
    };
    const colAgesTwenties: TableColumn<DT_ROW_TYPE> = {
      id: "agesTwenties",
      name: intl.get("col.a_twenties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_twenties ? row.a_twenties : "-"),
      sortFunction: (a, b) => (a.a_twenties > b.a_twenties ? 1 : -1),
    };
    const colAgesThirties: TableColumn<DT_ROW_TYPE> = {
      id: "agesThirties",
      name: intl.get("col.a_thirties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_thirties ? row.a_thirties : "-"),
      sortFunction: (a, b) => (a.a_thirties > b.a_thirties ? 1 : -1),
    };
    const colAgesFourties: TableColumn<DT_ROW_TYPE> = {
      id: "agesFourties",
      name: intl.get("col.a_fourties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_fourties ? row.a_fourties : "-"),
      sortFunction: (a, b) => (a.a_fourties > b.a_fourties ? 1 : -1),
    };
    const colAgesFifties: TableColumn<DT_ROW_TYPE> = {
      id: "agesFifties",
      name: intl.get("col.a_fifties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_fifties ? row.a_fifties : "-"),
      sortFunction: (a, b) => (a.a_fifties > b.a_fifties ? 1 : -1),
    };
    const colAgesSixties: TableColumn<DT_ROW_TYPE> = {
      id: "agesSixties",
      name: intl.get("col.a_sixties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_sixties ? row.a_sixties : "-"),
      sortFunction: (a, b) => (a.a_sixties > b.a_sixties ? 1 : -1),
    };
    const colAgesSeventies: TableColumn<DT_ROW_TYPE> = {
      id: "agesSeventies",
      name: intl.get("col.a_seventies"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_seventies ? row.a_seventies : "-"),
      sortFunction: (a, b) => (a.a_seventies > b.a_seventies ? 1 : -1),
    };
    const colAgesEighties: TableColumn<DT_ROW_TYPE> = {
      id: "agesEighties",
      name: intl.get("col.a_eighties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_eighties ? row.a_eighties : "-"),
      sortFunction: (a, b) => (a.a_eighties > b.a_eighties ? 1 : -1),
    };
    const colAgesNineties: TableColumn<DT_ROW_TYPE> = {
      id: "agesNineties",
      name: intl.get("col.a_nineties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_nineties ? row.a_nineties : "-"),
      sortFunction: (a, b) => (a.a_nineties > b.a_nineties ? 1 : -1),
    };

    const colGendersNodata: TableColumn<DT_ROW_TYPE> = {
      id: "gendersNodata",
      name: intl.get("col.g_nodata"),
      sortable: true,
      right: true,
      selector: (row) => (row.g_nodata ? row.g_nodata : "-"),
      sortFunction: (a, b) => (a.g_nodata > b.g_nodata ? 1 : -1),
    };
    const colGendersMale: TableColumn<DT_ROW_TYPE> = {
      id: "gendersMale",
      name: intl.get("col.g_male"),
      sortable: true,
      right: true,
      selector: (row) => (row.g_male ? row.g_male : "-"),
      sortFunction: (a, b) => (a.g_male > b.g_male ? 1 : -1),
    };
    const colGendersFemale: TableColumn<DT_ROW_TYPE> = {
      id: "gendersFemale",
      name: intl.get("col.g_female"),
      sortable: true,
      right: true,
      selector: (row) => (row.g_female ? row.g_female : "-"),
      sortFunction: (a, b) => (a.g_female > b.g_female ? 1 : -1),
    };
    const colGendersOther: TableColumn<DT_ROW_TYPE> = {
      id: "gendersOther",
      name: intl.get("col.g_other"),
      sortable: true,
      right: true,
      selector: (row) => (row.g_other ? row.g_other : "-"),
      sortFunction: (a, b) => (a.g_other > b.g_other ? 1 : -1),
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
      width: "200px",
      // selector: (row) => getCVLanguageRecord(row.locale).native_name,
      selector: (row) => getCVLanguageText(row.locale),
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

    //
    // Text Corpus Columns
    //
    const calcTCTotal: TableColumn<DT_ROW_TYPE> = {
      id: "tcTotal",
      name: intl.get("calc.tc.total"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.totalSentences ? row.totalSentences.toLocaleString(langCode) : "-",
    };
    const colTCValidated: TableColumn<DT_ROW_TYPE> = {
      id: "tcValidated",
      name: intl.get("col.tc.validated"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.validatedSentences
          ? row.validatedSentences.toLocaleString(langCode)
          : "-",
      sortFunction: (a, b) =>
        a.validatedSentences > b.validatedSentences ? 1 : -1,
    };
    const colTCUnvalidated: TableColumn<DT_ROW_TYPE> = {
      id: "tcUnvalidated",
      name: intl.get("col.tc.unvalidated"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.unvalidatedSentences
          ? row.unvalidatedSentences.toLocaleString(langCode)
          : "-",
      sortFunction: (a, b) =>
        a.unvalidatedSentences > b.unvalidatedSentences ? 1 : -1,
    };
    const calcTCValidatedPercentage: TableColumn<DT_ROW_TYPE> = {
      id: "tcTotal",
      name: intl.get("calc.tc.validated_percentage"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.validSentencePercentage
          ? row.validSentencePercentage.toFixed(2)
          : "-",
      sortFunction: (a, b) =>
        a.validSentencePercentage! > b.validSentencePercentage! ? 1 : -1,
    };
    const calcTCWithDomain: TableColumn<DT_ROW_TYPE> = {
      id: "tcWithDomain",
      name: intl.get("calc.tc.with_domain"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) =>
        row.sentencesWithDomain
          ? row.sentencesWithDomain.toLocaleString(langCode)
          : "-",
      sortFunction: (a, b) =>
        a.sentencesWithDomain! > b.sentencesWithDomain! ? 1 : -1,
    };
    const calcTCWithDomainPercentage: TableColumn<DT_ROW_TYPE> = {
      id: "tcWithDomainPercentage",
      name: intl.get("calc.tc.with_domain_percentage"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) =>
        row.sentencesWithDomainPercentage
          ? row.sentencesWithDomainPercentage.toFixed(2)
          : "-",
      sortFunction: (a, b) =>
        a.sentencesWithDomainPercentage! > b.sentencesWithDomainPercentage!
          ? 1
          : -1,
    };
    //
    // Text Corpus Columns
    //
    const colSDAgricultureFood: TableColumn<DT_ROW_TYPE> = {
      id: "sdAggFood",
      name: intl.get("dom.agriculture_food"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_agriculture_food ? row.sd_agriculture_food.toLocaleString(langCode) : "-",
    };

    const colSDAutomotiveTransport: TableColumn<DT_ROW_TYPE> = {
      id: "sdAutoTransport",
      name: intl.get("dom.automotive_transport"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_automotive_transport ? row.sd_automotive_transport.toLocaleString(langCode) : "-",
    };
    const colSDFinance: TableColumn<DT_ROW_TYPE> = {
      id: "sdFinance",
      name: intl.get("dom.finance"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_finance ? row.sd_finance.toLocaleString(langCode) : "-",
    };
    const colSDGeneral: TableColumn<DT_ROW_TYPE> = {
      id: "sdGeneral",
      name: intl.get("dom.general"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_general ? row.sd_general.toLocaleString(langCode) : "-",
    };
    const colSDHealthcare: TableColumn<DT_ROW_TYPE> = {
      id: "sdHealthcare",
      name: intl.get("dom.healthcare"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_healthcare ? row.sd_healthcare.toLocaleString(langCode) : "-",
    };
    const colSDHistoryLawGovernment: TableColumn<DT_ROW_TYPE> = {
      id: "sdHistLawGov",
      name: intl.get("dom.history_law_government"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_history_law_government ? row.sd_history_law_government.toLocaleString(langCode) : "-",
    };
    const colSDLanguageFundamentals: TableColumn<DT_ROW_TYPE> = {
      id: "sdLangFund",
      name: intl.get("dom.language_fundamentals"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_language_fundamentals ? row.sd_language_fundamentals.toLocaleString(langCode) : "-",
    };
    const colSDMediaEntertainment: TableColumn<DT_ROW_TYPE> = {
      id: "sdMediaEnt",
      name: intl.get("dom.media_entertainment"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_media_entertainment ? row.sd_media_entertainment.toLocaleString(langCode) : "-",
    };
    const colSDNatureEnvironment: TableColumn<DT_ROW_TYPE> = {
      id: "sdNatureEnv",
      name: intl.get("dom.nature_environment"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_nature_environment ? row.sd_nature_environment.toLocaleString(langCode) : "-",
    };
    const colSDNewsCurrentAffairs: TableColumn<DT_ROW_TYPE> = {
      id: "sdNews",
      name: intl.get("dom.news_current_affairs"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_news_current_affairs ? row.sd_news_current_affairs.toLocaleString(langCode) : "-",
    };
    const colSDTechnologyRobotics: TableColumn<DT_ROW_TYPE> = {
      id: "sdTechRob",
      name: intl.get("dom.technology_robotics"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_technology_robotics ? row.sd_technology_robotics.toLocaleString(langCode) : "-",
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
          colLocale,
          apiNativeName,
          colAvgDurationSecs,
          calcValidHrsPercentage,
          calcInvalidRecsPercentage,
          colClips,
          colTotalHrs,
          colValidHrs,
          colBucketsInValidated,
        ];
        viewTitle = intl.get("menu.views.calculated");
        break;
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
          colUsers,
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
          colUsers,
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
      case "textcorpus":
        viewCols = [
          colVersion,
          colLocale,
          apiNativeName,
          calcTCTotal,
          colTCValidated,
          colTCUnvalidated,
          calcTCValidatedPercentage,
          calcTCWithDomain,
          calcTCWithDomainPercentage,
        ];
        viewTitle = intl.get("menu.views.textcorpus");
        break;
      case "domains":
        viewCols = [
          colVersion,
          colLocale,
          apiNativeName,
          calcTCTotal,
          calcTCWithDomain,
          colSDGeneral,
          colSDAgricultureFood,
          colSDAutomotiveTransport,
          colSDFinance,
          colSDHealthcare,
          colSDHistoryLawGovernment,
          colSDLanguageFundamentals,
          colSDMediaEntertainment,
          colSDNatureEnvironment,
          colSDNewsCurrentAffairs,
          colSDTechnologyRobotics,
        ];
        viewTitle = intl.get("menu.views.domains");
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
      if (tableView === "domains") {
        res = res.filter((row) => Number(row.version) >= 17.0 );
      }
      return res;
    },
    [languageFilter, versionFilter, tableView],
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
      // if (row.a_teens)
      newRow.a_teens = Math.floor(100 * row.a_teens);
      // if (row.a_twenties)
      newRow.a_twenties = Math.floor(100 * row.a_twenties);
      // if (row.a_thirties)
      newRow.a_thirties = Math.floor(100 * row.a_thirties);
      // if (row.a_fourties)
      newRow.a_fourties = Math.floor(100 * row.a_fourties);
      // if (row.a_fifties)
      newRow.a_fifties = Math.floor(100 * row.a_fifties);
      // if (row.a_sixties)
      newRow.a_sixties = Math.floor(100 * row.a_sixties);
      // if (row.a_seventies)
      newRow.a_seventies = Math.floor(100 * row.a_seventies);
      // if (row.a_eighties)
      newRow.a_eighties = Math.floor(100 * row.a_eighties);
      // if (row.a_nineties)
      newRow.a_nineties = Math.floor(100 * row.a_nineties);
      // if (row.a_nodata)
      newRow.a_nodata = Math.floor(100 * row.a_nodata);

      // if (row.g_male)
      newRow.g_male = Math.floor(100 * row.g_male);
      // if (row.g_female)
      newRow.g_female = Math.floor(100 * row.g_female);
      // if (row.g_other)
      newRow.g_other = Math.floor(100 * row.g_other);
      // if (row.g_nodata)
      newRow.g_nodata = Math.floor(100 * row.g_nodata);

      // if (row.size)
      newRow.size = Math.round(row.size / (1024 * 1024));

      //
      // calculated fields
      //
      if (row.clips !== 0) {
        newRow.validRecsPercentage = (100 * row.b_validated) / row.clips;
        newRow.invalidRecsPercentage =
          (100 * row.b_invalidated) / row.clips;
        newRow.otherRecsPercentage = (100 * row.b_other) / row.clips;
      }
      if (row.totalHrs > 0) {
        newRow.validatedHrsPercentage = (100 * row.validHrs) / row.totalHrs;
      }
      if (row.users > 0) {
        newRow.avgRecsPerUser = row.clips / row.users;
        newRow.avgSecsPerUser = row.duration / row.users;
      }
      if (row.b_validated > 0) {
        newRow.percentageUsed =
          (100 * (row.b_train + row.b_dev + row.b_test)) /
          row.b_validated;
        newRow.estTrainHrs =
          row.validHrs * (row.b_train / row.b_validated);
        newRow.estDevHrs =
          row.validHrs * (row.b_dev / row.b_validated);
        newRow.estTestHrs =
          row.validHrs * (row.b_test / row.b_validated);
      }
      if (row.g_male > 0)
        newRow.fmRatio = row.g_female / row.g_male;
      if (row.g_nodata !== 1) {
        newRow.malePercentage =
          (100 * row.g_male) / (1 - row.g_nodata);
        newRow.femalePercentage =
          (100 * row.g_female) / (1 - row.g_nodata);
      }
      // New text corpora related
      newRow.totalSentences = row.validatedSentences + row.unvalidatedSentences;
      newRow.validSentencePercentage =
        newRow.totalSentences > 0
          ? (100 * row.validatedSentences) / newRow.totalSentences
          : 0;
      newRow.sentencesWithDomain =
        row.sd_agriculture_food +
        row.sd_automotive_transport +
        row.sd_finance +
        row.sd_service_retail +
        // row.sd_general + // ignore ganeral
        row.sd_healthcare +
        row.sd_history_law_government +
        row.sd_language_fundamentals +
        row.sd_media_entertainment +
        row.sd_nature_environment +
        row.sd_news_current_affairs;
      newRow.sentencesWithDomainPercentage =
        row.validatedSentences > 0
          ? (100 * newRow.sentencesWithDomain) / row.validatedSentences
          : 0;
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
        tc_total: 0,
        tc_val: 0,
        tc_unval: 0,
        tc_val_percentage: 0,
        tc_with_domain: 0,
        tc_domain_percentage: 0,
        // sentence domains
        sd_nodata: 0,
        sd_agriculture_food: 0,
        sd_automotive_transport: 0,
        sd_finance: 0,
        sd_service_retail: 0,
        sd_general: 0,
        sd_healthcare: 0,
        sd_history_law_government: 0,
        sd_language_fundamentals: 0,
        sd_media_entertainment: 0,
        sd_nature_environment: 0,
        sd_news_current_affairs: 0,
        sd_technology_robotics: 0,
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

      // Text Corpus Totals
      res.tc_total = subset.reduce((sum, row) => {
        return sum + row.totalSentences!;
      }, 0);
      res.tc_val = subset.reduce((sum, row) => {
        return sum + row.validatedSentences!;
      }, 0);
      res.tc_unval = subset.reduce((sum, row) => {
        return sum + row.unvalidatedSentences!;
      }, 0);
      res.tc_val_percentage =
        res.tc_total > 0 ? (100 * res.tc_val) / res.tc_total : 0;
      res.tc_with_domain = subset.reduce((sum, row) => {
        return sum + row.sentencesWithDomain!;
      }, 0);
      res.tc_domain_percentage =
        res.tc_val > 0 ? (100 * res.tc_with_domain) / res.tc_val : 0;
      // sentence domain details
      res.sd_agriculture_food = subset.reduce((sum, row) => {
        return sum + row.sd_agriculture_food!;
      }, 0);
      res.sd_automotive_transport = subset.reduce((sum, row) => {
        return sum + row.sd_automotive_transport!;
      }, 0);
      res.sd_finance = subset.reduce((sum, row) => {
        return sum + row.sd_finance!;
      }, 0);
      res.sd_general = subset.reduce((sum, row) => {
        return sum + row.sd_general!;
      }, 0);
      res.sd_healthcare = subset.reduce((sum, row) => {
        return sum + row.sd_healthcare!;
      }, 0);
      res.sd_history_law_government = subset.reduce((sum, row) => {
        return sum + row.sd_history_law_government!;
      }, 0);
      res.sd_language_fundamentals = subset.reduce((sum, row) => {
        return sum + row.sd_language_fundamentals!;
      }, 0);
      res.sd_media_entertainment = subset.reduce((sum, row) => {
        return sum + row.sd_media_entertainment!;
      }, 0);
      res.sd_nature_environment = subset.reduce((sum, row) => {
        return sum + row.sd_nature_environment!;
      }, 0);
      res.sd_news_current_affairs = subset.reduce((sum, row) => {
        return sum + row.sd_news_current_affairs!;
      }, 0);
      res.sd_service_retail = subset.reduce((sum, row) => {
        return sum + row.sd_service_retail!;
      }, 0);
      res.sd_technology_robotics = subset.reduce((sum, row) => {
        return sum + row.sd_technology_robotics!;
      }, 0);
      

      // put row to table
      totals.push(res);
    });

    return totals;
  };

  const exportCVSMetadataMemo = useMemo(
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
      let rawdata = METADATA_RAW.data as CV_METADATATABLE_TYPE;
      rawdata = rawdata.filter((row) => !IGNORE_VERSIONS.includes(row.version));
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
      actions={exportCVSMetadataMemo}
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
  ): [TableColumn<TOTALS_ROW_TYPE>[], string, TableColumn<TOTALS_ROW_TYPE>[], string] => {
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
    //
    // Text Corpus Columns
    //
    const calcTCTotal: TableColumn<TOTALS_ROW_TYPE> = {
      id: "tcTotal",
      name: intl.get("calc.tc.total"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.tc_total ? row.tc_total.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (Number(a.tc_total) > Number(b.tc_total) ? 1 : -1),
    };
    const colTCValidated: TableColumn<TOTALS_ROW_TYPE> = {
      id: "tcValidated",
      name: intl.get("col.tc.validated"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.tc_val ? row.tc_val.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.tc_val > b.tc_val ? 1 : -1),
    };
    const colTCUnvalidated: TableColumn<TOTALS_ROW_TYPE> = {
      id: "tcUnvalidated",
      name: intl.get("col.tc.unvalidated"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.tc_unval ? row.tc_unval.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.tc_unval > b.tc_unval ? 1 : -1),
    };
    const calcTCValidatedPercentage: TableColumn<TOTALS_ROW_TYPE> = {
      id: "tcTotal",
      name: intl.get("calc.tc.validated_percentage"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.tc_val_percentage ? row.tc_val_percentage.toFixed(2) : "-",
      sortFunction: (a, b) =>
        a.tc_val_percentage! > b.tc_val_percentage! ? 1 : -1,
    };
    const calcTCWithDomain: TableColumn<TOTALS_ROW_TYPE> = {
      id: "tcWithDomain",
      name: intl.get("calc.tc.with_domain"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) =>
        row.tc_with_domain ? row.tc_with_domain.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.tc_with_domain! > b.tc_with_domain! ? 1 : -1),
    };
    const calcTCWithDomainPercentage: TableColumn<TOTALS_ROW_TYPE> = {
      id: "tcWithDomainPercentage",
      name: intl.get("calc.tc.with_domain_percentage"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) =>
        row.tc_domain_percentage ? row.tc_domain_percentage.toFixed(2) : "-",
      sortFunction: (a, b) =>
        a.tc_domain_percentage! > b.tc_domain_percentage! ? 1 : -1,
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
    //
    // Text Corpus Columns
    //
    const colSDAgricultureFood: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdAggFood",
      name: intl.get("dom.agriculture_food"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_agriculture_food ? row.sd_agriculture_food.toLocaleString(langCode) : "-",
    };

    const colSDAutomotiveTransport: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdAutoTransport",
      name: intl.get("dom.automotive_transport"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_automotive_transport ? row.sd_automotive_transport.toLocaleString(langCode) : "-",
    };
    const colSDFinance: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdFinance",
      name: intl.get("dom.finance"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_finance ? row.sd_finance.toLocaleString(langCode) : "-",
    };
    const colSDGeneral: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdGeneral",
      name: intl.get("dom.general"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_general ? row.sd_general.toLocaleString(langCode) : "-",
    };
    const colSDHealthcare: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdHealthcare",
      name: intl.get("dom.healthcare"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_healthcare ? row.sd_healthcare.toLocaleString(langCode) : "-",
    };
    const colSDHistoryLawGovernment: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdHistLawGov",
      name: intl.get("dom.history_law_government"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_history_law_government ? row.sd_history_law_government.toLocaleString(langCode) : "-",
    };
    const colSDLanguageFundamentals: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdLangFund",
      name: intl.get("dom.language_fundamentals"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_language_fundamentals ? row.sd_language_fundamentals.toLocaleString(langCode) : "-",
    };
    const colSDMediaEntertainment: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdMediaEnt",
      name: intl.get("dom.media_entertainment"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_media_entertainment ? row.sd_media_entertainment.toLocaleString(langCode) : "-",
    };
    const colSDNatureEnvironment: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdNatureEnv",
      name: intl.get("dom.nature_environment"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_nature_environment ? row.sd_nature_environment.toLocaleString(langCode) : "-",
    };
    const colSDNewsCurrentAffairs: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdNews",
      name: intl.get("dom.news_current_affairs"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_news_current_affairs ? row.sd_news_current_affairs.toLocaleString(langCode) : "-",
    };
    const colSDTechnologyRobotics: TableColumn<TOTALS_ROW_TYPE> = {
      id: "sdTechRob",
      name: intl.get("dom.technology_robotics"),
      sortable: true,
      right: true,
      width: "70px",
      selector: (row) =>
        row.sd_technology_robotics ? row.sd_technology_robotics.toLocaleString(langCode) : "-",
    };

    let viewCols1: TableColumn<TOTALS_ROW_TYPE>[];
    let viewTitle1 = "";
    let viewCols2: TableColumn<TOTALS_ROW_TYPE>[];
    let viewTitle2: string = "";

    viewCols1 = [
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
    viewCols2 = [
      colVersion,
      colDate,
      calcTCTotal,
      colTCValidated,
      colTCUnvalidated,
      calcTCValidatedPercentage,
      calcTCWithDomain,
      calcTCWithDomainPercentage,
      colSDGeneral,
      colSDAgricultureFood,
      colSDAutomotiveTransport,
      colSDFinance,
      colSDHealthcare,
      colSDHistoryLawGovernment,
      colSDLanguageFundamentals,
      colSDMediaEntertainment,
      colSDNatureEnvironment,
      colSDNewsCurrentAffairs,
      colSDTechnologyRobotics,
    ];
    viewTitle1 = intl.get("menu.views.totals");
    viewTitle2 = intl.get("menu.views.totals2");
    // console.log(viewCols, viewTitle)
    return [viewCols1, viewTitle1, viewCols2, viewTitle2];
  };
  const paginationComponentOptions = {
    rowsPerPageText: intl.get("pagination.perpage"),
    rangeSeparatorText: intl.get("pagination.rangeseparator"),
    selectAllRowsItem: true,
    selectAllRowsItemText: intl.get("pagination.selectallrows"),
  };

  const [viewColumns1, viewTitle1, viewColumns2, viewTitle2] = getTotalsTableView(langCode);

  const exportCVSTotalsMemo = useMemo(
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
    <>
      <DataTable
        columns={viewColumns1}
        data={cvTotals}
        progressPending={!cvTotals}
        responsive
        dense
        pagination
        paginationPerPage={20}
        paginationComponentOptions={paginationComponentOptions}
        direction={Direction.AUTO}
        highlightOnHover
        title={viewTitle1}
        persistTableHead
        defaultSortFieldId={"version"}
        defaultSortAsc={false}
        customStyles={TABLE_STYLE}
        actions={exportCVSTotalsMemo}
      />
      <DataTable
        columns={viewColumns2}
        data={cvTotals.filter(row => row.tc_total > 0)}
        progressPending={!cvTotals}
        responsive
        dense
        pagination
        paginationPerPage={20}
        paginationComponentOptions={paginationComponentOptions}
        direction={Direction.AUTO}
        highlightOnHover
        title={viewTitle2}
        persistTableHead
        defaultSortFieldId={"version"}
        defaultSortAsc={false}
        customStyles={TABLE_STYLE}
        actions={exportCVSTotalsMemo}
      />
    </>
  );
};
