import React, { useEffect } from "react";
import intl from "react-intl-universal";
// MUI
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import { useStore } from "../stores/store";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const FilterSelectors = () => {
  const { metaData } = useStore();
  const [version, setVersion] = React.useState<string[]>([]);
  const [locale, setLocale] = React.useState<string[]>([]);

  const handleVersionFilterChange = (e: SelectChangeEvent<typeof version>) => {
    const {
      target: { value },
    } = e;
    // On autofill we get a stringified value.
    setVersion(typeof value === "string" ? value.split(",") : value);
  };

  const handleLocaleFilterChange = (e: SelectChangeEvent<typeof locale>) => {
    const {
      target: { value },
    } = e;
    // On autofill we get a stringified value.
    setLocale(typeof value === "string" ? value.split(",") : value);
  };

  let versionList: string[] = [];
  let localeList: string[] = [];

  if (metaData) {
    // get unique lists
    let versionCol = metaData.map((row) => {
      return row.version.toString();
    });
    versionList = [...new Set(versionCol)];
    let localeCol = metaData.map((row) => {
      return row.locale;
    });
    localeList = [...new Set(localeCol)].sort();
  }

  return !metaData ? (
    <></>
  ) : (
    <>
      <div>
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="ui-version-filter-select">
            {intl.get("ui.filter_version.label")}
          </InputLabel>
          <Select
            labelId="ui-version-filter-select"
            id="ui-version-filter-select"
            title={intl.get("ui.filter_version.title")}
            multiple
            value={version}
            onChange={handleVersionFilterChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
            label={intl.get("ui.filter_version.label")}
          >
            {versionList.map((x) => {
              return (
                <MenuItem key={x} value={x}>
                  <Checkbox checked={versionList.indexOf(x) > -1} />
                  <ListItemText primary={x} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <div>
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="ui-language-filter-select">
            {intl.get("ui.filter_language.label")}
          </InputLabel>
          <Select
            labelId="ui-language-filter-select"
            id="ui-language-filter-select"
            title={intl.get("ui.filter_language.title")}
            multiple
            value={locale}
            onChange={handleLocaleFilterChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
            label={intl.get("ui.filter_language.label")}
          >
            {localeList.map((x) => {
              return (
                <MenuItem key={x} value={x}>
                  <Checkbox checked={localeList.indexOf(x) > -1} />
                  <ListItemText primary={x} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    </>
  );
};
