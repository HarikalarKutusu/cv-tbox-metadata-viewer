import { useEffect } from "react";
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
  // Store
  const { initDone, setInitDone } = useStore();
  const { langCode, setLangCode } = useStore();
  // get list
  const enabledLanguages = getEnabledUILanguages();

  const handleLanguageChange = (e: SelectChangeEvent) => {
    const newLangCode = e.target.value as LanguageCodesType;
    setLangCode(newLangCode);
    uiLocaleInit(newLangCode);
  };

  useEffect(() => {
    if (!initDone) {
      // i18n
      uiLocaleInit().then(() => {
        const { currentLocale } = intl.getInitOptions();
        setLangCode(currentLocale as LanguageCodesType);
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
          title={intl.get("ui.languageselector.title")}
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
