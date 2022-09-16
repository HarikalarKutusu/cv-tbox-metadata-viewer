import React, { useEffect } from "react";
import intl from "react-intl-universal";
import { getMetaDataTableView } from "../helpers/dataTableHelper";

import {
  getEnabledUILanguages,
  uiLocaleInit,
  LanguageCodesType,
} from "./../helpers/localeHelper";

import { useStore } from "./../stores/store";

export const LanguageSelector = (props: any) => {
  //   if (!initDone) return <>...</>;

  // Store
  const { initDone, setInitDone } = useStore();
  const { langCode, setLangCode } = useStore();
  const { metaData, setMetaData } = useStore();
  // get list
  const enabledLanguages = getEnabledUILanguages();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLangCode = e.target.value as LanguageCodesType;
    setLangCode(newLangCode);
    uiLocaleInit(newLangCode);
    // TODO re-render table to get new language strings
    // setMetaData(getMetaDataTableView('main'))
  };

  useEffect(() => {
    console.log("languageSelector - useEffect");

    if (!initDone) {
      console.log("languageSelector - !initDone");
      // i18n
      uiLocaleInit().then(() => {
        console.log("languageSelector - localeInit THEN");
        const { currentLocale } = intl.getInitOptions();
        // debugApp && console.log("APP - LangInit=", currentLocale);
        setLangCode(currentLocale as LanguageCodesType);
        // set initDone
        setInitDone(true);
      });
    }
  }, [initDone, setInitDone, setLangCode]);

  return !initDone ? (
    <></>
  ) : (
    <select
      title={intl.get("ui.languageselector.title")}
      id="langSelector"
      className="language-selector"
      value={langCode}
      onChange={(e) => handleLanguageChange(e)}
    >
      {enabledLanguages.map((lang) => {
        return (
          <option key={lang.code} value={lang.code} className="language-option">
            {lang.code}-{lang.nativeName}
          </option>
        );
      })}
    </select>
  );
};
