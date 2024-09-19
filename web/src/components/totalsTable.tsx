// React
import { useMemo } from "react";
// i10n
import intl from "react-intl-universal";
// MUI
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

// DataTable
import DataTable, { Direction, TableColumn } from "react-data-table-component";

// App
import { useStore } from "../stores/store";
import {
  TOTALS_ROW_TYPE,
  TABLE_STYLE,
  dec2,
  downloadCSV,
} from "../helpers/dataTableHelper";
//
// JSX
//
// TOTALS TABLE

export const TotalsTable = () => {
  const { initDone } = useStore();
  const { langCode } = useStore();
  const { cvTotals } = useStore();

  const getTotalsTableView = (
    langCode: string,
  ): [
    TableColumn<TOTALS_ROW_TYPE>[],
    string,
    TableColumn<TOTALS_ROW_TYPE>[],
    string,
  ] => {
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
      sortFunction: (a, b) =>
        Number(a.tc_total) > Number(b.tc_total) ? 1 : -1,
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

  const [viewColumns1, viewTitle1, viewColumns2, viewTitle2] =
    getTotalsTableView(langCode);

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
        data={cvTotals.filter((row) => row.tc_total > 0)}
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
