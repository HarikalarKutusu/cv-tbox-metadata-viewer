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
  downloadCSV,
  DELTA_TABLE_TYPE,
  DELTA_ROW_TYPE,
} from "../helpers/dataTableHelper";
import { appDatasetAnalyzerURL } from "./../helpers/appHelper";

// Data
import METADATA_RAW from "./../assets/data/$metadata.json";

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
  const { setCVDelta } = useStore();
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
        row.b_validated ? row.b_validated.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.b_validated > b.b_validated ? 1 : -1),
    };
    const colBucketsInValidated: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsInValidated",
      name: intl.get("col.buckets_invalidated"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_invalidated ? row.b_invalidated.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.b_invalidated > b.b_invalidated ? 1 : -1),
    };
    const colBucketsOther: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsOther",
      name: intl.get("col.buckets_other"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_other ? row.b_other.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.b_other > b.b_other ? 1 : -1),
    };
    const colBucketsTrain: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsTrain",
      name: intl.get("col.buckets_train"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_train ? row.b_train.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.b_train > b.b_train ? 1 : -1),
    };
    const colBucketsDev: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsDev",
      name: intl.get("col.buckets_dev"),
      sortable: true,
      right: true,
      selector: (row) => (row.b_dev ? row.b_dev.toLocaleString(langCode) : "-"),
      sortFunction: (a, b) => (a.b_dev > b.b_dev ? 1 : -1),
    };
    const colBucketsTest: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsTest",
      name: intl.get("col.buckets_test"),
      sortable: true,
      right: true,
      selector: (row) =>
        row.b_test ? row.b_test.toLocaleString(langCode) : "-",
      sortFunction: (a, b) => (a.b_test > b.b_test ? 1 : -1),
    };
    const colBucketsReported: TableColumn<DT_ROW_TYPE> = {
      id: "bucketsReported",
      name: intl.get("col.buckets_reported"),
      sortable: true,
      right: true,
      // selector: (row) => row.b_reported,
      // NOTE: Reported sentences removed from "buckets" category to new reportedSentences field
      cell: (row) =>
        (row.b_reported
          ? row.b_reported
          : 0 + row.reportedSentences
          ? row.reportedSentences
          : 0
        ).toLocaleString(langCode),
    };

    const colAgesNodata: TableColumn<DT_ROW_TYPE> = {
      id: "agesNodata",
      name: intl.get("col.ages_nodata"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_nodata ? row.a_nodata : "-"),
      sortFunction: (a, b) => (a.a_nodata > b.a_nodata ? 1 : -1),
    };
    const colAgesTeens: TableColumn<DT_ROW_TYPE> = {
      id: "agesTeens",
      name: intl.get("col.ages_teens"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_teens ? row.a_teens : "-"),
      sortFunction: (a, b) => (a.a_teens > b.a_teens ? 1 : -1),
    };
    const colAgesTwenties: TableColumn<DT_ROW_TYPE> = {
      id: "agesTwenties",
      name: intl.get("col.ages_twenties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_twenties ? row.a_twenties : "-"),
      sortFunction: (a, b) => (a.a_twenties > b.a_twenties ? 1 : -1),
    };
    const colAgesThirties: TableColumn<DT_ROW_TYPE> = {
      id: "agesThirties",
      name: intl.get("col.ages_thirties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_thirties ? row.a_thirties : "-"),
      sortFunction: (a, b) => (a.a_thirties > b.a_thirties ? 1 : -1),
    };
    const colAgesFourties: TableColumn<DT_ROW_TYPE> = {
      id: "agesFourties",
      name: intl.get("col.ages_fourties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_fourties ? row.a_fourties : "-"),
      sortFunction: (a, b) => (a.a_fourties > b.a_fourties ? 1 : -1),
    };
    const colAgesFifties: TableColumn<DT_ROW_TYPE> = {
      id: "agesFifties",
      name: intl.get("col.ages_fifties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_fifties ? row.a_fifties : "-"),
      sortFunction: (a, b) => (a.a_fifties > b.a_fifties ? 1 : -1),
    };
    const colAgesSixties: TableColumn<DT_ROW_TYPE> = {
      id: "agesSixties",
      name: intl.get("col.ages_sixties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_sixties ? row.a_sixties : "-"),
      sortFunction: (a, b) => (a.a_sixties > b.a_sixties ? 1 : -1),
    };
    const colAgesSeventies: TableColumn<DT_ROW_TYPE> = {
      id: "agesSeventies",
      name: intl.get("col.ages_seventies"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_seventies ? row.a_seventies : "-"),
      sortFunction: (a, b) => (a.a_seventies > b.a_seventies ? 1 : -1),
    };
    const colAgesEighties: TableColumn<DT_ROW_TYPE> = {
      id: "agesEighties",
      name: intl.get("col.ages_eighties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_eighties ? row.a_eighties : "-"),
      sortFunction: (a, b) => (a.a_eighties > b.a_eighties ? 1 : -1),
    };
    const colAgesNineties: TableColumn<DT_ROW_TYPE> = {
      id: "agesNineties",
      name: intl.get("col.ages_nineties"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => (row.a_nineties ? row.a_nineties : "-"),
      sortFunction: (a, b) => (a.a_nineties > b.a_nineties ? 1 : -1),
    };

    const colGendersNodata: TableColumn<DT_ROW_TYPE> = {
      id: "gendersNodata",
      name: intl.get("col.genders_nodata"),
      sortable: true,
      right: true,
      selector: (row) => (row.g_nodata ? row.g_nodata : "-"),
      sortFunction: (a, b) => (a.g_nodata > b.g_nodata ? 1 : -1),
    };
    const colGendersMale: TableColumn<DT_ROW_TYPE> = {
      id: "gendersMale",
      name: intl.get("col.genders_male"),
      sortable: true,
      right: true,
      selector: (row) => (row.g_male ? row.g_male : "-"),
      sortFunction: (a, b) => (a.g_male > b.g_male ? 1 : -1),
    };
    const colGendersFemale: TableColumn<DT_ROW_TYPE> = {
      id: "gendersFemale",
      name: intl.get("col.genders_female"),
      sortable: true,
      right: true,
      selector: (row) => (row.g_female ? row.g_female : "-"),
      sortFunction: (a, b) => (a.g_female > b.g_female ? 1 : -1),
    };
    const colGendersOther: TableColumn<DT_ROW_TYPE> = {
      id: "gendersOther",
      name: intl.get("col.genders_other"),
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
      selector: (row) =>
        row.totalSentences ? row.totalSentences.toLocaleString(langCode) : "-",
    };
    const colTCValidated: TableColumn<DT_ROW_TYPE> = {
      id: "tcValidated",
      name: intl.get("col.tc.validated"),
      sortable: true,
      right: true,
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
      selector: (row) =>
        row.sentencesWithDomainPercentage
          ? row.sentencesWithDomainPercentage.toFixed(2)
          : "-",
      sortFunction: (a, b) =>
        a.sentencesWithDomainPercentage! > b.sentencesWithDomainPercentage!
          ? 1
          : -1,
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
          colBucketsReported,
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
          colBucketsReported,
        ];
        viewTitle = intl.get("menu.views.textcorpus");
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
        newRow.invalidRecsPercentage = (100 * row.b_invalidated) / row.clips;
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
          (100 * (row.b_train + row.b_dev + row.b_test)) / row.b_validated;
        newRow.estTrainHrs = row.validHrs * (row.b_train / row.b_validated);
        newRow.estDevHrs = row.validHrs * (row.b_dev / row.b_validated);
        newRow.estTestHrs = row.validHrs * (row.b_test / row.b_validated);
      }
      if (row.g_male > 0) newRow.fmRatio = row.g_female / row.g_male;
      if (row.g_nodata !== 1) {
        newRow.malePercentage = (100 * row.g_male) / (1 - row.g_nodata);
        newRow.femalePercentage = (100 * row.g_female) / (1 - row.g_nodata);
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
        row.sd_general +
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

      // put row to table
      totals.push(res);
    });

    return totals;
  };

  const calcCVDelta = (data: CV_METADATATABLE_TYPE) => {
    const delta: DELTA_TABLE_TYPE = []; // This will be the returned value
    const languages = [...new Set(data.map((row) => row.locale))].sort(); // get all languages
    languages.forEach((lc) => {
      // get data with that language code, sorted in inc. ver
      const lcdata = data
        .filter((row) => row.locale === lc)
        .sort((a, b) =>
          parseFloat(a.version) > parseFloat(b.version) ? 1 : -1,
        );
      // get first, then loop from second till end to get delta values
      let rec0: DT_ROW_TYPE = lcdata[0]; // get first at 0
      // loop through rest
      lcdata.slice(1).forEach((rec1) => {
        const delta_rec: DELTA_ROW_TYPE = {
          version: rec0.version + " » " + rec1.version,
          days: Math.ceil(
            (new Date(rec1.date).getTime() - new Date(rec0.date).getTime()) /
              (1000 * 3600 * 24),
          ),
          locale: lc,

          clips: rec1.clips - rec0.clips,
          users: rec1.users - rec0.users,
          totalHrs: rec1.totalHrs - rec0.totalHrs,
          validHrs: rec1.validHrs - rec0.validHrs,
          avgDurationSecs: rec1.avgDurationSecs - rec0.avgDurationSecs,

          b_validated: rec1.b_validated - rec0.b_validated,
          b_invalidated: rec1.b_invalidated - rec0.b_invalidated,
          b_other: rec1.b_other - rec0.b_other,
          b_train: rec1.b_train - rec0.b_train,
          b_dev: rec1.b_dev - rec0.b_dev,
          b_test: rec1.b_test - rec0.b_test,
          b_reported:
            (rec1.b_reported
              ? rec1.b_reported
              : 0 + rec1.reportedSentences
              ? rec1.reportedSentences
              : 0) -
            (rec1.b_reported
              ? rec0.b_reported
              : 0 + rec0.reportedSentences
              ? rec0.reportedSentences
              : 0),

          validRecsPercentage:
            rec1.validRecsPercentage! - rec0.validRecsPercentage!,
          invalidRecsPercentage:
            rec1.invalidRecsPercentage! - rec0.invalidRecsPercentage!,
          otherRecsPercentage:
            rec1.otherRecsPercentage! - rec0.otherRecsPercentage!,
          validatedHrsPercentage:
            rec1.validatedHrsPercentage! - rec0.validatedHrsPercentage!,
          avgRecsPerUser: rec1.avgRecsPerUser! - rec0.avgRecsPerUser!,
          avgSecsPerUser: rec1.avgSecsPerUser! - rec0.avgSecsPerUser!,
          percentageUsed: rec1.percentageUsed! - rec0.percentageUsed!,
          malePercentage: rec1.malePercentage! - rec0.malePercentage!,
          femalePercentage: rec1.femalePercentage! - rec0.femalePercentage!,

          totalSentences: rec1.totalSentences! - rec0.totalSentences!,
          sentencesWithDomain:
            rec1.sentencesWithDomain! - rec0.sentencesWithDomain!,
        };
        delta.push(delta_rec);
        rec0 = rec1;
      });
    });
    console.log(delta);
    return delta;
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
      const delta = calcCVDelta(calcdata);
      setMetaData(calcdata);
      setCVTotals(totals);
      setCVDelta(delta);
    } else {
      // console.log("!!! METADATA READY !!!");
    }
  }, [metaData, setMetaData, setCVTotals, setCVDelta]);

  return !metaData || !initDone ? (
    <></>
  ) : (
    <DataTable
      columns={viewColumns}
      data={
        tableView === "textcorpus"
          ? applyFilters(metaData).filter((row) => row.totalSentences! > 0)
          : applyFilters(metaData)
      }
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
