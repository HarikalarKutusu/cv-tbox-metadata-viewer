// React
import { useEffect } from "react";
// i10n
import intl from "react-intl-universal";

// DataTable
import DataTable, { Direction } from "react-data-table-component";

// App
import {
  getMetaDataTableView,
  getTotalsTableView,
  CV_METADATATABLE_TYPE,
  TOTALS_TABLE_TYPE,
  TOTALS_ROW_TYPE,
  DT_ROW_TYPE,
} from "../helpers/dataTableHelper";

import { useStore } from "../stores/store";

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
  const { tableView } = useStore();
  const { versionFilter } = useStore();
  const { languageFilter } = useStore();

  // const view = props.view ? props.view : "main";

  const [viewColumns, viewTitle] = getMetaDataTableView(tableView, langCode);

  const paginationComponentOptions = {
    rowsPerPageText: intl.get("pagination.perpage"),
    rangeSeparatorText: intl.get("pagination.rangeseparator"),
    selectAllRowsItem: true,
    selectAllRowsItemText: intl.get("pagination.selectallrows"),
  };

  const applyFilters = (data: CV_METADATATABLE_TYPE) => {
    let res: CV_METADATATABLE_TYPE = data;
    if (versionFilter.length > 0) {
      res = res.filter((row) => versionFilter.includes(row.version));
    }
    if (languageFilter.length > 0) {
      res = res.filter((row) => languageFilter.includes(row.locale));
    }
    return res;
  };

  const calcCalculatedFields = (data: CV_METADATATABLE_TYPE) => {
    const newData: CV_METADATATABLE_TYPE = [];
    data.forEach((row) => {
      // initialize with loaded data
      const newRow: DT_ROW_TYPE = row;
      // calculated fields (round them for visibity)
      newRow.validRecsPercentage =
        Math.round(10000 * (row.buckets_validated / row.clips)) / 100;
      newRow.invalidRecsPercentage =
        Math.round(10000 * (row.buckets_invalidated / row.clips)) / 100;
      newRow.otherRecsPercentage =
        Math.round(10000 * (row.buckets_other / row.clips)) / 100;
      newRow.validatedHrsPercentage =
        Math.round(10000 * (row.validHrs / row.totalHrs)) / 100;
      newRow.reportedPercentage =
        Math.round(10000 * (row.buckets_reported / row.clips)) / 100;

      newRow.avgRecsPerUser = Math.round(100 * (row.clips / row.users)) / 100;
      newRow.avgSecsPerUser =
        Math.round(100 * (row.duration / 1000 / row.users)) / 100;
      newRow.percentageUsed =
        Math.round(
          10000 *
            ((row.buckets_train + row.buckets_dev + row.buckets_test) /
              row.buckets_validated),
        ) / 100;
      newRow.estTrainHrs =
        Math.round(
          100 * row.validHrs * (row.buckets_train / row.buckets_validated),
        ) / 100;
      newRow.estDevHrs =
        Math.round(
          100 * row.validHrs * (row.buckets_dev / row.buckets_validated),
        ) / 100;
      newRow.estTestHrs =
        Math.round(
          100 * row.validHrs * (row.buckets_test / row.buckets_validated),
        ) / 100;
      newRow.fmRatio =
        Math.round(100 * (row.genders_female / row.genders_male)) / 100;
      newRow.malePercentage =
        Math.round(10000 * (row.genders_male / (1 - row.genders_nodata))) / 100;
      newRow.femalePercentage =
        Math.round(10000 * (row.genders_female / (1 - row.genders_nodata))) /
        100;
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
      // put row to table
      totals.push(res);
    });
    // console.log(totals);
    return totals;
  };

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
      // sortIcon={sortIcon}
      // sortFunction={numericSort}
      // onSort

      // fixedHeader
      // fixedHeaderScrollHeight="300px"
      // subHeader
      // subHeaderWrap
      // subHeaderAlign={Alignment.RIGHT}
      // subHeaderComponent={Filter}
      // selectableRows
      // selectableRowsHig hlight
      // selectableRowsNoSelectAll
      // selectableRowsRadio="checkbox"
      // selectableRowsComponent={Checkbox}
      // selectableRowsComponentProps={selectProps}

      // noDataComponent
      // onRowClicked
      // onRowDoubleClicked
      // onRowMouseEnter
      // onRowMouseLeave
      // onColumnOrderChange

      // expandableRows
      // expandableRowsComponent
      // expandableRowsComponentProps
    />
  );
};

// TOTALS TABLE

export const TotalsTable = () => {
  const { initDone } = useStore();
  const { langCode } = useStore();
  const { cvTotals } = useStore();

  // const view = props.view ? props.view : "main";

  const [viewColumns, viewTitle] = getTotalsTableView(langCode);

  const paginationComponentOptions = {
    rowsPerPageText: intl.get("pagination.perpage"),
    rangeSeparatorText: intl.get("pagination.rangeseparator"),
    selectAllRowsItem: true,
    selectAllRowsItemText: intl.get("pagination.selectallrows"),
  };

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
      // fixedHeader
      // fixedHeaderScrollHeight="300px"
      persistTableHead
      // subHeader
      // subHeaderWrap
      // subHeaderAlign={Alignment.RIGHT}
      // subHeaderComponent={Filter}
      // sortIcon={sortIcon}
      // selectableRows
      // selectableRowsHig hlight
      // selectableRowsNoSelectAll
      // selectableRowsRadio="checkbox"
      // selectableRowsComponent={Checkbox}
      // selectableRowsComponentProps={selectProps}

      // noDataComponent
      // onRowClicked
      // onRowDoubleClicked
      // onRowMouseEnter
      // onRowMouseLeave
      // onColumnOrderChange

      // sortFunction={numericSort}
      // onSort

      // expandableRows
      // expandableRowsComponent
      // expandableRowsComponentProps
    />
  );
};
