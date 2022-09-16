// React
import React, { Suspense, useEffect, useState } from "react";
import intl from "react-intl-universal";

import {
  getEnabledUILanguages,
  uiLocaleInit,
  LanguageCodesType,
} from "./helpers/localeHelper";
import { useStore } from "./stores/store";

import "./App.css";

import { LanguageSelector } from "./components/languageSelector";
import { MetadataTable } from "./components/metaDataTable";
import {
  METADATA_FILE,
  loadMetadata,
  getLastVersion,
  getLocaleList,
  getVersionList,
} from "./helpers/metadataHelper";
import DataFrame from "dataframe-js";

import { AppUI } from "./components/ui/ui";

function App() {
  // Is data ready?
  // const [initDone, setInitDone] = useState(false);
  const { initDone, setInitDone } = useStore();
  // Store
  const { langCode, setLangCode } = useStore();
  const { metaData, setMetaData } = useStore();

  // let metaData: MetaData = new MetaData();

  useEffect(() => {
    console.log("APP - useEffect");

    // UI Language
    if (!initDone) {
      console.log("App - !initDone");
      // i18n
      uiLocaleInit().then(() => {
        console.log("APP - intlInit THEN");
        const { currentLocale } = intl.getInitOptions();
        // debugApp && console.log("APP - LangInit=", currentLocale);
        setLangCode(currentLocale as LanguageCodesType);
        // set initDone
        setInitDone(true);
      });
    }
    // Metadata
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
        <Suspense>
          {/* <LanguageSelector /> */}
          {/* <br /> */}
          {/* { intl.get('app.title')} */}
          {/* <MetadataTable
            view="main"
            defaultSortField="version"
            defaultSortAsc={false}
          /> */}
          <AppUI />
        </Suspense>
      </div>
      ;
    </>
  ); // return
} // App

export default App;
