import React, { useEffect } from "react";
import intl from "react-intl-universal";

import { useStore } from "../stores/store";

export const VersionSelector = () => {
  const { metaData } = useStore();

  const handleVersionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const newLangCode = e.target.value as LanguageCodesType;
    // setLangCode(newLangCode);
    // uiLocaleInit(newLangCode);
  };

  let optionKeys = [""];
  let optionStrings = [intl.get("ui.filter.version")];
  if (metaData) {
    metaData.map((rec) => {
      optionKeys.push(rec.version.toString());
      optionStrings.push("v" + rec.version + " - " + rec.date);
    });
  }
  const numOptions = optionKeys.length;

  return !metaData ? (
    <></>
  ) : (
    <select
      title={intl.get("ui.filter.language")}
      id="versionSelector"
      className="version-selector"
      // value={langCode}
      onChange={(e) => handleVersionFilterChange(e)}
    >
      {metaData.map((rec) => {
        return (
          <option
            key={rec.version}
            value={rec.version}
            className="version-option"
          >
            v{rec.version} - {rec.date}
          </option>
        );
      })}
    </select>
  );
};
