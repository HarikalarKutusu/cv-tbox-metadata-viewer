// App related / app-wide stuff

export const appVersion = "v0.3.2b";
export const appDataDate = "2022-09-25";

// URLs
export const appCommonVoiceURL = "https://commonvoice.mozilla.org/";
export const appGithubURL =
  "https://github.com/HarikalarKutusu/cv-tbox-metadata-viewer";
export const appLicenseURL =
  "https://github.com/HarikalarKutusu/cv-tbox-metadata-viewer/blob/main/LICENSE";

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
