import intl from "react-intl-universal";

export type LanguageCodesType = "en" | "tr";
export const LANGUAGES: LanguageCodesType[] = ["en", "tr"];
export const DEFAULT_LANGUAGE: LanguageCodesType = "en";

// Short list to be used in selector
export type LanguageListType = {
    code: LanguageCodesType;
    nativeName: string;
  };

// Extended list including everthing needed for STT
export type UILanguageType = {
  code: LanguageCodesType;
  name: string;
  nativeName: string;
  enabled: number;
};

// common locale data
require("intl/locale-data/jsonp/en");
require("intl/locale-data/jsonp/tr");

// app locale data (translated strings)
export const UI_LANGUAGES: UILanguageType[] = [
  // require("./../locales/en/en.json"),
  // require("./../locales/tr/tr.json"),
  {
    "code": "en",
    "name": "English",
    "nativeName": "English",
    "enabled": 1
  },
  {
    "code": "tr",
    "name": "Turkish",
    "nativeName": "Türkçe",
    "enabled": 1
  }
];


// Some may be manually disabled, so only get enabled ones
export const getEnabledUILanguages = () => {
  return UI_LANGUAGES.filter((rec) => rec.enabled === 1);
};

// Get a single record (e.g. current language)
export const getUILanguage = (langCode: LanguageCodesType) => {
  return UI_LANGUAGES.find((rec) => rec.code === langCode)!;
};

// Get a list for language selector {code, nativeName}
export const getLanguageList = () => {
  const res: LanguageListType[] = [];
  UI_LANGUAGES.forEach((rec) => {
    if (rec.enabled === 1)
      res.push({ code: rec.code, nativeName: rec.nativeName });
  });
  return res;
};

//================================
// i18n by react-intl-universal
//================================

// common locale data
require("intl/locale-data/jsonp/de");
require("intl/locale-data/jsonp/en");
require("intl/locale-data/jsonp/tr");

// app locale data (translated strings)
export const LOCALES = {
  en: require("./../locales/en/messages.json"),
  tr: require("./../locales/tr/messages.json"),
};

// Initialize - returns the selected default language
export const intlInit = (reqLocale?: LanguageCodesType) => {
  console.log("intlInit");

  let resLang: string = DEFAULT_LANGUAGE; // assume default
  if (!reqLocale) { // No specific locale requested, decide from browser and/or default
    // try user’s browser language
    const browserLang: string = navigator.language.split(/[-_]/)[0];
    // check if available, if not choose default
    resLang = browserLang in LANGUAGES ? browserLang : DEFAULT_LANGUAGE;
  } else { // 
    resLang = reqLocale;
  }
  //
  // console.log("INIT-INLT=", resLang);
  // returns a promise
  return intl.init({
    currentLocale: resLang,
    fallbackLocale: DEFAULT_LANGUAGE,
    locales: UI_LANGUAGES,
  });
};
  
// export const onLanguageChange = () => {};
