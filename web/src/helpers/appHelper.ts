//
// App related / app-wide stuff
//
// App Version
import packageJson from "./../../package.json";
export const appVersion: string = packageJson.version;
export const isBeta: boolean = packageJson.version.endsWith("b");
export const appDataDate = "2025-12-12";

// URLs
export const appCommonVoiceURL = "https://commonvoice.mozilla.org/";
export const appGithubURL =
  "https://github.com/HarikalarKutusu/cv-tbox-metadata-viewer";
export const appLicenseURL =
  "https://github.com/HarikalarKutusu/cv-tbox-metadata-viewer/blob/main/LICENSE";
// export const appDatasetAnalyzerURL = "https://cv-dataset-analyzer.netlify.app/";
export const appDatasetAnalyzerURL = "https://analyzer.cv-toolbox.web.tr/";

export const cleanFn = (s: string): string => {
  const toReplace = [
    "?",
    "[",
    "]",
    "/",
    "\\",
    "=",
    "<",
    ">",
    ":",
    ";",
    ",",
    "'",
    '"',
    "&",
    "$",
    "#",
    "*",
    "(",
    ")",
    "|",
    "~",
    "`",
    "!",
    "{",
    "}",
    "%",
    "+",
    String.fromCharCode(0),
  ];
  let fn = s.toLowerCase();
  toReplace.forEach((ch) => (fn = fn.replaceAll(ch, "_")));
  return fn;
};
