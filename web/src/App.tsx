// React
import React, { Suspense, useEffect, useState } from "react";
import intl from "react-intl-universal";

import { getEnabledUILanguages, intlInit, LanguageCodesType } from "./helpers/localeHelper";
import { useStore } from "./stores/store";

import "./App.css";

import { MetadataTable } from './components/metaDataTable'
import { METADATA_FILE, loadMetadata, getLastVersion, getLocaleList, getVersionList } from "./helpers/metadataHelper";
import DataFrame from "dataframe-js";


function App() {

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLangCode = e.target.value as LanguageCodesType;
    setLangCode(newLangCode);
    intlInit(newLangCode);
  };

  const LanguageSelector = (props: any) => {
    if (!initDone) return <>...</>;

    // const enabledLanguages = VOICE_LANGUAGES.filter((l) => l.enabled === 1);
    const enabledLanguages = getEnabledUILanguages();

    return (
      <select
        title={intl.get("ui.languageselector.title")}
        id="langSelector"
        className="language-selector"
        value={langCode}
        onChange={(e) => handleLanguageChange(e)}
      >
        {enabledLanguages.map((lang) => {
          return (
            <option
              key={lang.code}
              value={lang.code}
              className="language-option"
            >
              {lang.code}-{lang.nativeName}
            </option>
          );
        })}
      </select>
    );
  };


  // Is data ready?
  const [ initDone, setInitDone ] = useState(false);
  // const { initDone, setInitDone } = useStore();
  // Store
  const { langCode, setLangCode } = useStore();
  const { metaData, setMetaData } = useStore();

  // let metaData: MetaData = new MetaData();

  useEffect(() => {
    console.log("APP - useEffect");

    if (!initDone) {
      console.log("App - !initDone");
      // i18n
      intlInit().then(() => {
        console.log("APP - intlInit THEN");
        const { currentLocale } = intl.getInitOptions();
        // debugApp && console.log("APP - LangInit=", currentLocale);
        setLangCode(currentLocale as LanguageCodesType);
        // set initDone
        setInitDone(true);
      });
    }
    // if (!metaData) {
    //   console.log("APP - !metaData");
    //   DataFrame.fromTSV(METADATA_FILE).then(df => {
    //     console.log("APP - intlInit Load Metadata THEN");
    //     setMetaData(df);
    //   })
    // }
  }, [initDone, setInitDone, setLangCode, metaData, setMetaData]);

  return !initDone ? (
    <></>
  ) : (
    <>
      <div className="App data_table">
        {/* <LanguageSelector /> */}
        <MetadataTable view='main' defaultSortField="version" defaultSortAsc={false} />
      </div>
      ;
    </>
  ); // return
} // App

export default App;
