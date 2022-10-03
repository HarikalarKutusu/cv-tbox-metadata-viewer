// i10n
import intl from "react-intl-universal";
// MUI
import {
  ListItem,
  ListItemIcon,
  OutlinedInput,
  ListItemText,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
} from '@mui/material';
import { SelectChangeEvent } from "@mui/material/Select";

// Version Filter
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// Language Filter
import LanguageIcon from "@mui/icons-material/Language";

// App
import { useStore } from "../stores/store";


export const FilterSelectors = () => {
  const { metaData } = useStore();
  const { versionFilter, setVersionFilter } = useStore();
  const { languageFilter, setLanguageFilter } = useStore();
  const { tableView } = useStore();

  const handleVersionFilterChange = (
    e: SelectChangeEvent<typeof versionFilter>,
  ) => {
    const {
      target: { value },
    } = e;
    // On autofill we get a stringified value.
    setVersionFilter(typeof value === "string" ? value.split(",") : value);
  };

  const handleLocaleFilterChange = (
    e: SelectChangeEvent<typeof languageFilter>,
  ) => {
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
    versionList = [...new Set(versionCol)].sort(
      (a, b) => Number(b) - Number(a),
    );
    // versionList = versionList.reverse()
    let localeCol = metaData.map((row) => {
      return row.locale;
    });
    languageList = [...new Set(localeCol)].sort();
  }

  const isDisabled = tableView === "totals";

  return !metaData ? (
    <></>
  ) : (
    <>
      <ListItem>
        <ListItemIcon>
          <CalendarMonthIcon />
        </ListItemIcon>
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="ui-version-filter-select">
            {intl.get("ui.filter_version.label")}
          </InputLabel>
          <Select
            disabled={isDisabled}
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
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <LanguageIcon />
        </ListItemIcon>
        <FormControl sx={{ m: 0, minWidth: 150 }}>
          <InputLabel id="ui-language-filter-select">
            {intl.get("ui.filter_language.label")}
          </InputLabel>
          <Select
            disabled={isDisabled}
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
      </ListItem>
    </>
  );
};
