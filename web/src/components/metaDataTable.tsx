import { useEffect } from "react";
import intl from "react-intl-universal";

import { useStore } from "../stores/store";

import { DataFrame } from "dataframe-js";

import DataTable, {
  // TableColumn,
  // TableProps,
  Direction,
  // Alignment,
  // Media,
} from "react-data-table-component";

import { getMetaDataTableView, DT_ROW_TYPE } from "../helpers/dataTableHelper";

import METADATA_RAW from "./../assets/data/$metadata.json";

// import Checkbox from "@mui/material/Checkbox";
// import ArrowDownward from "@mui/icons-material/ArrowDownward";

// const sortIcon = <ArrowDownward />;

//
// JSX
//

export type MetadataTableProps = {
  data?: DataFrame;
  view?: string; // default: 'main'
  defaultSortField?: string;
  defaultSortAsc?: boolean;
};

export const MetadataTable = (props: MetadataTableProps) => {
  const { initDone } = useStore();
  const { langCode } = useStore();
  const { metaData, setMetaData } = useStore();
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

  const applyFilters = (data: DT_ROW_TYPE[]) => {
    let res: DT_ROW_TYPE[] = data;
    if (versionFilter.length > 0) {
      res = res.filter(row => versionFilter.includes(row.version))
    }
    if (languageFilter.length > 0) {
      res = res.filter(row => languageFilter.includes(row.locale))
    }
    return res
  }

  useEffect(() => {
    // make sure data is ready
    if (!metaData) {
      const rawdata = METADATA_RAW.data as DT_ROW_TYPE[];
      setMetaData(rawdata);
    } else {
      // console.log("!!! METADATA READY !!!");
    }
  }, [metaData, setMetaData]);

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
