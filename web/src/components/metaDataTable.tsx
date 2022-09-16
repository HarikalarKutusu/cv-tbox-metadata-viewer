import { useEffect } from "react";
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

import { getMetaDataTableView, DT_ROW_TYPE } from "../helpers/dataTableHelper";

import METADATA_RAW from "./../assets/data/$metadata.json";

import Checkbox from "@mui/material/Checkbox";
import ArrowDownward from "@mui/icons-material/ArrowDownward";

const sortIcon = <ArrowDownward />;

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
  console.log("MetadataTable");

  const { initDone } = useStore();
  const { metaData, setMetaData } = useStore();
  const { langCode } = useStore();

  const view = props.view ? props.view : "main";

  const [viewColumns, viewTitle] = getMetaDataTableView(view, langCode);

  const paginationComponentOptions = {
    rowsPerPageText: intl.get('pagination.perpage'),
    rangeSeparatorText: intl.get('pagination.rangeseparator'),
    selectAllRowsItem: true,
    selectAllRowsItemText: intl.get('pagination.selectallrows'),
  };
  

  const numericSort = (rows: DT_ROW_TYPE[], selector: any, direction: any) => {

    return rows.sort ((rowA: DT_ROW_TYPE, rowB: DT_ROW_TYPE) => {
      const a = parseFloat(rowA.version)
      const b = parseFloat(rowA.version)
      let res = 0;
      if (a > b) {
        res = 1
      } else if (a < b) {
        res = -1
      }
      return direction === 'desc' ? res * -1 : res;
    })
  };
  

  useEffect(() => {
    console.log("MetadataTable -> useEffect");
    // make sure data is ready
    if (!metaData) {
      console.log("MetadataTable -> useEffect - !metaData");
      // const METADATA_RAW = JSON.parse(require ('./../assets/data/$metadata.json')) as IMetaDataRaw[];
      const rawdata = METADATA_RAW.data as DT_ROW_TYPE[];
      // console.log(rawdata.length);
      // console.log(rawdata);
      setMetaData(rawdata);
      // const raw = JSON.parse(METADATA_RAW);
    } else {
      console.log("!!! METADATA READY !!!");
    }
  }, [metaData, setMetaData]);

  // return !metaData || !initDone ? (
  return !metaData || !initDone ? (
    <></>
  ) : (
    <DataTable
      columns={viewColumns}
      data={metaData}
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
      subHeader
      // subHeaderWrap
      subHeaderAlign={Alignment.RIGHT}
      // subHeaderComponent={Filter}
      // sortIcon={sortIcon}
      selectableRows
      selectableRowsHighlight
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
