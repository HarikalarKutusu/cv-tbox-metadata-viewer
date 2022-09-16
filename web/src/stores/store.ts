// State management / store using zustand

import create from "zustand";
import { DataFrame } from "dataframe-js";
import { DT_ROW_TYPE } from "./../helpers/dataTableHelper"
import { LanguageCodesType, DEFAULT_UI_LOCALE } from "./../helpers/localeHelper";

export type StoreType = {
  // Init Done
  initDone: boolean;
  setInitDone: (status: boolean) => void;

  // UI language
  langCode: LanguageCodesType;
  setLangCode: (langCode: LanguageCodesType) => void;

  // language data
  languageData: DataFrame | undefined;
  setLanguageData: (df: DataFrame) => void;

  // metadata
  metaData: DT_ROW_TYPE[] | undefined;
  setMetaData: (df: DT_ROW_TYPE[]) => void;

  // Table View
  tableView: string;
  setTableView: (view: string) => void;

  // selected version filter

  // selected language filter

  // language working set

  // version working set

};

const useStore = create<StoreType>((set) => ({
  // Init Done
  initDone: false,
  setInitDone: (status) => set((state) => ({ ...state, initDone: status })),

  // language
  langCode: DEFAULT_UI_LOCALE,
  setLangCode: (langCode) => set((state) => ({ ...state, langCode: langCode })),

  // language data
  languageData: undefined,
  setLanguageData: (df) => set((state) => ({ ...state, languageData: df })),

  // metadata
  metaData: undefined,
  setMetaData: (df) => set((state) => ({ ...state, metaData: df })),

  // Table View
  tableView: 'main',
  setTableView: (view: string) => set((state) => ({ ...state, tableView: view })),
}));

export { useStore };
