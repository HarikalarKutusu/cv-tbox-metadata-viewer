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
import { useStore } from "../stores/store";
import { useEffect } from "react";

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

const MetadataTable = (props: MetadataTableProps) => {
  console.log("MetadataTable");

  const { initDone } = useStore();
  const { metaData, setMetaData } = useStore();

  const view = props.view ? props.view : "main";

  const DT_COLS_MAIN = getMetaDataTableView(view);

  useEffect(() => {
    console.log("MetadataTable -> useEffect");
    // make sure data is ready
    if (!metaData) {
      console.log("MetadataTable -> useEffect - !metaData");
      // const METADATA_RAW = JSON.parse(require ('./../assets/data/$metadata.json')) as IMetaDataRaw[];
      const rawdata = METADATA_RAW.data as DT_ROW_TYPE[];
      console.log(rawdata.length);
      console.log(rawdata);
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
      columns={DT_COLS_MAIN}
      data={metaData}
      responsive
      dense
      pagination
      paginationPerPage={20}
      direction={Direction.AUTO}
      highlightOnHover
      title="Common Voice Metadata"
      fixedHeader
      fixedHeaderScrollHeight="300px"
      persistTableHead
      subHeader
      // subHeaderWrap
      subHeaderAlign={Alignment.RIGHT}
      sortIcon={sortIcon}
      selectableRows
      selectableRowsHighlight
      selectableRowsNoSelectAll
      // selectableRowsRadio="checkbox"

      // expandableRows
      // expandableRowsComponent=

      // selectableRowsComponent={Checkbox}
      // selectableRowsComponentProps={selectProps}

      // noDataComponent
      // onRowClicked
      // onRowDoubleClicked
      // onRowMouseEnter
      // onRowMouseLeave
      // onColumnOrderChange
      // sortFunction
      // onSort

      // expandableRows
      // expandableRowsComponent
      // expandableRowsComponentProps


    />
  );
};

export { MetadataTable };
