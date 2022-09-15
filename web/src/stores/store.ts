// State management / store using zustand

import create from "zustand";
import { DataFrame } from "dataframe-js";
import { DT_ROW_TYPE } from "./../helpers/dataTableHelper"
import { LanguageCodesType, DEFAULT_LANGUAGE } from "./../helpers/localeHelper";

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
  // metaData: DataFrame | undefined;
  // setMetaData: (df: DataFrame) => void;
  metaData: DT_ROW_TYPE[] | undefined;
  setMetaData: (df: DT_ROW_TYPE[]) => void;

  // language working set

  // version working set
};

const useStore = create<StoreType>((set) => ({
  // Init Done
  initDone: false,
  setInitDone: (status) => set((state) => ({ ...state, initDone: status })),

  // language
  langCode: DEFAULT_LANGUAGE,
  setLangCode: (langCode) => set((state) => ({ ...state, langCode: langCode })),

  // language data
  languageData: undefined,
  setLanguageData: (df) => set((state) => ({ ...state, languageData: df })),

  // metadata
  metaData: undefined,
  setMetaData: (df) => set((state) => ({ ...state, metaData: df })),
}));

export { useStore };
