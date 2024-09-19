// State management / store using zustand
import create from "zustand";

// App
import {
  CV_METADATATABLE_TYPE,
  TOTALS_TABLE_TYPE,
  DELTA_TABLE_TYPE,
} from "./../helpers/dataTableHelper";
import {
  LanguageCodesType,
  DEFAULT_UI_LOCALE,
} from "./../helpers/localeHelper";

export type StoreType = {
  // Init Done
  initDone: boolean;
  setInitDone: (status: boolean) => void;

  // UI language
  langCode: LanguageCodesType;
  setLangCode: (langCode: LanguageCodesType) => void;

  // metadata
  metaData: CV_METADATATABLE_TYPE | undefined;
  setMetaData: (dt: CV_METADATATABLE_TYPE) => void;

  // cv Aggregated data per version
  cvTotals: TOTALS_TABLE_TYPE | undefined;
  setCVTotals: (dt: TOTALS_TABLE_TYPE) => void;

  // cv data changes between versions
  cvDelta: DELTA_TABLE_TYPE | undefined;
  setCVDelta: (dt: DELTA_TABLE_TYPE) => void;

  // Table View
  tableView: string;
  setTableView: (view: string) => void;

  // selected version filter
  versionFilter: string[];
  setVersionFilter: (lst: string[]) => void;

  // selected language filter
  languageFilter: string[];
  setLanguageFilter: (lst: string[]) => void;
};

const useStore = create<StoreType>((set) => ({
  // Init Done
  initDone: false,
  setInitDone: (status) => set((state) => ({ ...state, initDone: status })),

  // language
  langCode: DEFAULT_UI_LOCALE,
  setLangCode: (langCode) => set((state) => ({ ...state, langCode: langCode })),

  // metadata
  metaData: undefined,
  setMetaData: (dt) => set((state) => ({ ...state, metaData: dt })),

  // torals
  cvTotals: undefined,
  setCVTotals: (dt) => set((state) => ({ ...state, cvTotals: dt })),

  // delta
  cvDelta: undefined,
  setCVDelta: (dt) => set((state) => ({ ...state, cvDelta: dt })),

  // Table View
  tableView: "main",
  setTableView: (view: string) =>
    set((state) => ({ ...state, tableView: view })),

  // selected version filter
  versionFilter: [],
  setVersionFilter: (lst: string[]) =>
    set((state) => ({ ...state, versionFilter: lst })),

  // selected language filter
  languageFilter: [],
  setLanguageFilter: (lst: string[]) =>
    set((state) => ({ ...state, languageFilter: lst })),
}));

export { useStore };
