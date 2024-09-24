// React
import { useCallback, useMemo } from "react";
// i10n
import intl from "react-intl-universal";
// MUI
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

// DataTable
import DataTable, { Direction, TableColumn } from "react-data-table-component";

// App
import { useStore } from "../stores/store";
import {
  DELTA_ROW_TYPE,
  DELTA_TABLE_TYPE,
  TABLE_STYLE,
  dec2,
  downloadCSV,
} from "../helpers/dataTableHelper";
//
// JSX
//
// TOTALS TABLE

export const DeltaTable = () => {
  const { initDone } = useStore();
  const { langCode } = useStore();
  const { cvDelta } = useStore();
  const { deltaVersionFilter } = useStore();
  const { languageFilter } = useStore();

  const getDeltaTableView = (
    langCode: string,
  ): [
    TableColumn<DELTA_ROW_TYPE>[],
    string,
    TableColumn<DELTA_ROW_TYPE>[],
    string,
    TableColumn<DELTA_ROW_TYPE>[],
    string,
  ] => {
    //
    // Table-1
    //
    const colVersion: TableColumn<DELTA_ROW_TYPE> = {
      id: "version",
      name: intl.get("col.version"),
      sortable: true,
      center: true,
      width: "120px",
      selector: (row) => row.version,
      sortFunction: (a, b) =>
        parseFloat(a.version) > parseFloat(b.version) ? 1 : -1,
    };
    const colDays: TableColumn<DELTA_ROW_TYPE> = {
      id: "days",
      name: intl.get("col.days"),
      sortable: true,
      center: true,
      width: "80px",
      selector: (row) => row.days,
    };
    const colLocale: TableColumn<DELTA_ROW_TYPE> = {
      id: "locale",
      name: intl.get("col.locale"),
      sortable: true,
      center: true,
      width: "80px",
      selector: (row) => row.locale,
    };
    // General
    const colClips: TableColumn<DELTA_ROW_TYPE> = {
      id: "clips",
      name: intl.get("col.clips"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => row.clips,
      cell: (row) => row.clips.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.clips < 0,
          style: { background: "pink" },
        },
      ],
    };
    const colUsers: TableColumn<DELTA_ROW_TYPE> = {
      id: "users",
      name: intl.get("col.users"),
      sortable: true,
      right: true,
      width: "80px",
      selector: (row) => row.users,
      cell: (row) => row.users.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.users < 0,
          style: { background: "pink" },
        },
      ],
    };
    const colTotalHrs: TableColumn<DELTA_ROW_TYPE> = {
      id: "totalHrs",
      name: intl.get("col.totalHrs"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.totalHrs,
      cell: (row) => Math.round(row.totalHrs).toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.totalHrs < 0,
          style: { background: "pink" },
        },
      ],
    };
    const colValidHrs: TableColumn<DELTA_ROW_TYPE> = {
      id: "validHrs",
      name: intl.get("col.validHrs"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.validHrs,
      cell: (row) => Math.round(row.validHrs).toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.validHrs < 0,
          style: { background: "pink" },
        },
      ],
    };
    const calcAvgDurClip: TableColumn<DELTA_ROW_TYPE> = {
      id: "calc_avg_dur_clip",
      name: intl.get("calc.avg_dur_clip"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) => row.avgDurationSecs.toFixed(3),
      conditionalCellStyles: [
        {
          when: (row) => row.avgDurationSecs < 0,
          style: { background: "pink" },
        },
      ],
    };
    const calcAvgDurUser: TableColumn<DELTA_ROW_TYPE> = {
      id: "calc_avg_dur_user",
      name: intl.get("calc.avg_secs_per_user"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) => row.avgSecsPerUser.toLocaleString(langCode, dec2),
      conditionalCellStyles: [
        {
          when: (row) => row.avgSecsPerUser < 0,
          style: { background: "pink" },
        },
      ],
    };
    const calcAvgRecsUser: TableColumn<DELTA_ROW_TYPE> = {
      id: "calc_avg_recs_user",
      name: intl.get("calc.avg_recs_per_user"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) => row.avgRecsPerUser.toLocaleString(langCode, dec2),
      conditionalCellStyles: [
        {
          when: (row) => row.avgSecsPerUser < 0,
          style: { background: "pink" },
        },
      ],
    };
    const calcTotalSentences: TableColumn<DELTA_ROW_TYPE> = {
      id: "calc_total_sentences",
      name: intl.get("calc.total_sentences"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) => row.totalSentences.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.totalSentences < 0,
          style: { background: "pink" },
        },
      ],
    };
    const calcWithDomain: TableColumn<DELTA_ROW_TYPE> = {
      id: "calc_with_domain",
      name: intl.get("calc.with_domain"),
      sortable: true,
      right: true,
      width: "120px",
      selector: (row) => row.sentencesWithDomain.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.sentencesWithDomain < 0,
          style: { background: "pink" },
        },
      ],
    };

    //
    // Table-2: Buckets
    //
    const colBucketsValidated: TableColumn<DELTA_ROW_TYPE> = {
      id: "b_validated",
      name: intl.get("col.buckets_validated"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.b_validated.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.b_validated < 0,
          style: { background: "pink" },
        },
      ],
    };
    const colBucketsInvalidated: TableColumn<DELTA_ROW_TYPE> = {
      id: "b_invalidated",
      name: intl.get("col.buckets_invalidated"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.b_invalidated.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.b_invalidated < 0,
          style: { background: "pink" },
        },
      ],
    };
    const colBucketsOther: TableColumn<DELTA_ROW_TYPE> = {
      id: "b_other",
      name: intl.get("col.buckets_other"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.b_other.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.b_other < 0,
          style: { background: "pink" },
        },
      ],
    };
    const colBucketsTrain: TableColumn<DELTA_ROW_TYPE> = {
      id: "b_train",
      name: intl.get("col.buckets_train"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.b_train.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.b_train < 0,
          style: { background: "pink" },
        },
      ],
    };
    const colBucketsDev: TableColumn<DELTA_ROW_TYPE> = {
      id: "b_dev",
      name: intl.get("col.buckets_dev"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.b_dev.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.b_dev < 0,
          style: { background: "pink" },
        },
      ],
    };
    const colBucketsTest: TableColumn<DELTA_ROW_TYPE> = {
      id: "b_test",
      name: intl.get("col.buckets_test"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.b_test.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.b_test < 0,
          style: { background: "pink" },
        },
      ],
    };
    const colBucketsReported: TableColumn<DELTA_ROW_TYPE> = {
      id: "b_reported",
      name: intl.get("col.buckets_reported"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) => row.b_reported.toLocaleString(langCode),
      conditionalCellStyles: [
        {
          when: (row) => row.b_reported < 0,
          style: { background: "pink" },
        },
      ],
    };
    //
    // Table 3 & For Graphs: Per month values
    //
    const calcMonthlyClips: TableColumn<DELTA_ROW_TYPE> = {
      id: "monthly_clips",
      name: intl.get("col.clips"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.mo_clips ? row.mo_clips.toLocaleString(langCode, dec2) : "-",
    };
    const calcMonthlyUsers: TableColumn<DELTA_ROW_TYPE> = {
      id: "monthly_users",
      name: intl.get("col.users"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.mo_users ? row.mo_users.toLocaleString(langCode, dec2) : "-",
    };
    const calcMonthlyHours: TableColumn<DELTA_ROW_TYPE> = {
      id: "monthly_totalHrs",
      name: intl.get("col.totalHrs"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.mo_totalHrs ? row.mo_totalHrs.toLocaleString(langCode, dec2) : "-",
    };
    const calcMonthlyValidatedHours: TableColumn<DELTA_ROW_TYPE> = {
      id: "monthly_validHrs",
      name: intl.get("col.validHrs"),
      sortable: true,
      right: true,
      width: "100px",
      selector: (row) =>
        row.mo_validHrs ? row.mo_validHrs.toLocaleString(langCode, dec2) : "-",
    };

    let viewCols1: TableColumn<DELTA_ROW_TYPE>[];
    let viewTitle1 = "";
    let viewCols2: TableColumn<DELTA_ROW_TYPE>[];
    let viewTitle2: string = "";
    let viewCols3: TableColumn<DELTA_ROW_TYPE>[];
    let viewTitle3: string = "";

    viewCols1 = [
      colVersion,
      colDays,
      colLocale,
      colClips,
      colUsers,
      colTotalHrs,
      colValidHrs,
      calcAvgDurClip,
      calcAvgDurUser,
      calcAvgRecsUser,
      calcTotalSentences,
      calcWithDomain,
      // colValidPercentage,
    ];
    viewCols2 = [
      colVersion,
      colLocale,
      colClips,
      colBucketsValidated,
      colBucketsInvalidated,
      colBucketsOther,
      colBucketsTrain,
      colBucketsDev,
      colBucketsTest,
      colBucketsReported,
      //
    ];
    viewCols3 = [
      colVersion,
      colLocale,
      calcMonthlyClips,
      calcMonthlyUsers,
      calcMonthlyHours,
      calcMonthlyValidatedHours,
      //
    ];
    viewTitle1 = intl.get("menu.views.delta");
    viewTitle2 = intl.get("menu.views.delta2");
    viewTitle3 = intl.get("menu.views.delta3");
    // console.log(viewCols, viewTitle)
    return [
      viewCols1,
      viewTitle1,
      viewCols2,
      viewTitle2,
      viewCols3,
      viewTitle3,
    ];
  };
  const paginationComponentOptions = {
    rowsPerPageText: intl.get("pagination.perpage"),
    rangeSeparatorText: intl.get("pagination.rangeseparator"),
    selectAllRowsItem: true,
    selectAllRowsItemText: intl.get("pagination.selectallrows"),
  };

  const [
    viewColumns1,
    viewTitle1,
    viewColumns2,
    viewTitle2,
    viewColumns3,
    viewTitle3,
  ] = getDeltaTableView(langCode);

  const exportCVSTotalsMemo = useMemo(
    () => (
      <DownloadForOfflineIcon
        onClick={() => downloadCSV(cvDelta!, ["totals"], [])}
        color="secondary"
        sx={{ cursor: "grab" }}
      />
    ),
    [cvDelta],
  );

  const applyFilters = useCallback(
    (data: DELTA_TABLE_TYPE) => {
      let res: DELTA_TABLE_TYPE = data;
      if (deltaVersionFilter.length > 0) {
        res = res.filter((row) => deltaVersionFilter.includes(row.version));
      }
      if (languageFilter.length > 0) {
        res = res.filter((row) => languageFilter.includes(row.locale));
      }
      return res;
    },
    [deltaVersionFilter, languageFilter],
  );

  return !cvDelta || !initDone ? (
    <></>
  ) : (
    <>
      <DataTable
        columns={viewColumns1}
        data={applyFilters(cvDelta)}
        progressPending={!cvDelta}
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
        data={applyFilters(cvDelta)}
        progressPending={!cvDelta}
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
      <DataTable
        columns={viewColumns3}
        data={applyFilters(cvDelta)}
        progressPending={!cvDelta}
        responsive
        dense
        pagination
        paginationPerPage={20}
        paginationComponentOptions={paginationComponentOptions}
        direction={Direction.AUTO}
        highlightOnHover
        title={viewTitle3}
        persistTableHead
        defaultSortFieldId={"version"}
        defaultSortAsc={false}
        customStyles={TABLE_STYLE}
        actions={exportCVSTotalsMemo}
      />
    </>
  );
};
