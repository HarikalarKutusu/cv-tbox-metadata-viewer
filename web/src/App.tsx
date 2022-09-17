// React
import { Suspense, useEffect } from "react";
import intl from "react-intl-universal";

import { uiLocaleInit, LanguageCodesType } from "./helpers/localeHelper";
import { useStore } from "./stores/store";

import "./App.css";

import { AppUI } from "./components/ui/ui";

function App() {
  // Store
  const { initDone, setInitDone } = useStore();
  const { setLangCode } = useStore();
  const { metaData, setMetaData } = useStore();

  useEffect(() => {
    // UI Language
    if (!initDone) {
      // i18n
      uiLocaleInit().then(() => {
        const { currentLocale } = intl.getInitOptions();
        setLangCode(currentLocale as LanguageCodesType);
        setInitDone(true);
      });
    }
  }, [initDone, setInitDone, setLangCode, metaData, setMetaData]);

  return !initDone ? (
    <></>
  ) : (
    <>
      <div className="App data_table">
        <Suspense>
          <AppUI />
        </Suspense>
      </div>
      ;
    </>
  ); // return
} // App

export default App;
