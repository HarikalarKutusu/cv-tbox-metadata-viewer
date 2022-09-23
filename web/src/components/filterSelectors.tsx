import React from "react";
import intl from "react-intl-universal";
// MUI
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// App
import { useStore } from "../stores/store";

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

export const FilterSelectors = () => {
  const { metaData } = useStore();
  // const [version, setVersion] = React.useState<string[]>([]);
  // const [locale, setLocale] = React.useState<string[]>([]);
  const {versionFilter, setVersionFilter} = useStore();
  const {languageFilter, setLanguageFilter} = useStore();

  const handleVersionFilterChange = (e: SelectChangeEvent<typeof versionFilter>) => {
    const {
      target: { value },
    } = e;
    // On autofill we get a stringified value.
    setVersionFilter(typeof value === "string" ? value.split(",") : value);
  };

  const handleLocaleFilterChange = (e: SelectChangeEvent<typeof languageFilter>) => {
    const {
      target: { value },
    } = e;
    // On autofill we get a stringified value.
    setLanguageFilter(typeof value === "string" ? value.split(",") : value);
  };

  let versionList: string[] = [];
  let languageList: string[] = [];

  if (metaData) {
    // get unique lists
    let versionCol = metaData.map((row) => {
      return row.version.toString();
    });
    versionList = [...new Set(versionCol)].sort((a,b) => Number(b) - Number(a));
    // versionList = versionList.reverse()
    let localeCol = metaData.map((row) => {
      return row.locale;
    });
    languageList = [...new Set(localeCol)].sort();
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
            value={versionFilter}
            onChange={handleVersionFilterChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            // MenuProps={MenuProps}
            label={intl.get("ui.filter_version.label")}
          >
            {versionList.map((x) => {
              return (
                <MenuItem key={x} value={x}>
                  <Checkbox checked={versionFilter.indexOf(x) > -1} />
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
            value={languageFilter}
            onChange={handleLocaleFilterChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            // MenuProps={MenuProps}
            label={intl.get("ui.filter_language.label")}
          >
            {languageList.map((x) => {
              return (
                <MenuItem key={x} value={x}>
                  <Checkbox checked={languageFilter.indexOf(x) > -1} />
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
