import React, { useEffect } from "react";
import intl from "react-intl-universal";
// MUI
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// APP
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
  // get list
  const enabledLanguages = getEnabledUILanguages();

//   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newLangCode = e.target.value as LanguageCodesType;
//     setLangCode(newLangCode);
//     uiLocaleInit(newLangCode);
//   };

  const handleLanguageChange = (e: SelectChangeEvent) => {
    const newLangCode = e.target.value as LanguageCodesType;
    setLangCode(newLangCode);
    uiLocaleInit(newLangCode);
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
      <div>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="ui-language-select">
            {intl.get("ui.languageselector.label")}
          </InputLabel>
          <Select
            labelId="ui-language-select"
            id="ui-language-select"
            value={langCode}
            onChange={handleLanguageChange}
            autoWidth
            label={intl.get("ui.languageselector.label")}
          >
            {enabledLanguages.map((lang) => {
              return (
                <MenuItem
                  key={lang.code}
                  value={lang.code}
                  className="ui-language-select-option"
                >
                  {lang.code}-{lang.nativeName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
  );
};
