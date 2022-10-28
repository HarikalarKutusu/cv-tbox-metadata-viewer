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
  TABLE_STYLE,
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
      customStyles={TABLE_STYLE}
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
      persistTableHead
      customStyles={TABLE_STYLE}
      // fixedHeader
      // fixedHeaderScrollHeight="300px"
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
