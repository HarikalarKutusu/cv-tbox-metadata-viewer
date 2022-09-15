import { DataFrame, Row, SQL } from "dataframe-js";

import DataTable, {
  TableColumn,
  TableProps,
  Direction,
  Alignment,
  Media,
} from "react-data-table-component";

export const METADATA_COLS = [
  "version",
  "date",
  "locale",
  "clips",
  "users",
  "duration",
  "totalHrs",
  "validHrs",
  "validDurationSecs",
  "avgDurationSecs",
  "buckets_validated",
  "buckets_invalidated",
  "buckets_other",
  "buckets_train",
  "buckets_dev",
  "buckets_test",
  "buckets_reported",
  "ages_nodata",
  "ages_teens",
  "ages_twenties",
  "ages_thirties",
  "ages_fourties",
  "ages_fifties",
  "ages_sixties",
  "ages_seventies",
  "ages_eighties",
  "ages_nineties",
  "genders_nodata",
  "genders_male",
  "genders_female",
  "genders_other",
  "reportedSentences",
  "size",
  "checksum",
];

export const METADATA_VIEWS = [
  "main",
  "buckets-all",
  "buckets-main",
  "buckets-model",
  "buckets-reported",
  "ages",
  "genders",
  "genders-fm-ratio",
  "avgduration",
];

export const METADATA_FILE = "./../assets/data/metadata.tsv";

export const loadMetadata = () => {
  DataFrame.fromTSV(METADATA_FILE).then((df) => {
    return df;
  });
};

export const getLastVersion = (df: DataFrame) => {
  const arr: Array<string> = df
    .select("version")
    .unique("version")
    .sortBy("version", true)
    .toArray();
  return arr.length > 0 ? arr[0] : -1;
};

export const getVersionList = (df: DataFrame) => {
  return df.select("version").unique("version").sortBy("version").toArray();
};

export const getLocaleList = (df: DataFrame) => {
  return df.select("locale").unique("version").sortBy("version").toArray();
};

// class xxxMetaData {
//     metadata: DataFrame | undefined = undefined;
//     languagedata: JSON | undefined = undefined;

//     constructor() {
//         // this.load()
//         this.metadata = undefined;
//         this.languagedata = undefined;
//     }

//     load() {
//         DataFrame.fromTSV(METADATA_FILE).then(df => {
//             this.metadata = df
//         })
//     }

//     print() {
//         this.metadata?.show()
//     }

//     private _getColumnUniqueAsArray(col: string, sortDesc?: boolean): Array<string> {
//         return this.metadata?.select(col).unique(col).sortBy(col).toArray()!
//     }

//     getLastVersion = () => {
//         const arr: Array<string> = this._getColumnUniqueAsArray('version', true)
//         // const arr: Array<string> = this.metadata?.select('version').unique('version').sortBy('version', true).toArray()!
//         return (arr.length > 0) ? arr[0] : ''
//     };

//     getVersionList = () => {
//         return this._getColumnUniqueAsArray('version', true)
//     };

//     getLocaleList = () => {
//         return this._getColumnUniqueAsArray('locale')
//     };

//     getLocaleVersionTable = () => {
//         const versions = this.getVersionList()
//         const locales = this.getLocaleList()
//     }

// }

// export { MetaData }

// export const getLastVersion = (df: DataFrame) => {
//     const arr: Array<string> = df.select('version').unique('version').sortBy('version', true).toArray()
//     return (arr.length > 0) ? arr[0] : -1
// };

// export const getVersionList = (df: DataFrame) => {
//     return df.select('version').unique('version').sortBy('version').toArray()
// };

// export const getLocaleList = (df: DataFrame) => {
//     return df.select('locale').unique('version').sortBy('version').toArray()
// };
