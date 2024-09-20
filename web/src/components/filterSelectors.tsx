// i10n
import intl from "react-intl-universal";
// MUI
import {
  OutlinedInput,
  ListItemText,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  Stack,
  ThemeProvider,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

// App
import { appTheme } from "./ui/theme";
import { useStore } from "../stores/store";
import { getCVLanguageRecord } from "../helpers/dataTableHelper";

const FilterSelectors = () => {
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

  const isTotals = tableView === "totals";
  const isDelta = tableView === "delta";

  return !metaData ? (
    <></>
  ) : (
    <ThemeProvider theme={appTheme}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="baseline"
        spacing={2}
        display="flex"
        color="inherit"
      >
        {/* Version Selector */}
        <FormControl sx={{ m: 1, minWidth: 160, maxWidth: 160 }} size="small">
          <InputLabel
            id="ui-version-filter-select-label"
            sx={{ color: isTotals ? "#000000" : "#fafafa" }}
          >
            {intl.get("ui.filter_version.label")}
          </InputLabel>
          <Select
            disabled={isTotals || isDelta}
            labelId="ui-version-filter-select"
            id="ui-version-filter-select"
            title={intl.get("ui.filter_version.title")}
            multiple
            value={versionFilter}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            // MenuProps={MenuProps}
            label={intl.get("ui.filter_version.label")}
            onChange={handleVersionFilterChange}
            sx={{
              height: "2.5rem",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSvgIcon-root": {
                color: isTotals ? "#000000" : "#fafafa",
              },
            }}
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
        {/* Locale Selector */}
        <FormControl sx={{ m: 1, minWidth: 160, maxWidth: 160 }} size="small">
          <InputLabel
            id="ui-language-filter-select-label"
            sx={{ color: isTotals ? "#000000" : "#fafafa" }}
          >
            {intl.get("ui.filter_language.label")}
          </InputLabel>
          <Select
            disabled={isTotals}
            labelId="ui-language-filter-select"
            id="ui-language-filter-select"
            title={intl.get("ui.filter_language.title")}
            label={intl.get("ui.filter_language.label")}
            multiple
            value={languageFilter}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            // MenuProps={MenuProps}
            onChange={handleLocaleFilterChange}
            sx={{
              height: "2.5rem",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSvgIcon-root": {
                color: isTotals ? "#000000" : "#fafafa",
              },
            }}
          >
            {languageList.map((x) => {
              const langRec = getCVLanguageRecord(x);
              return (
                <MenuItem key={x} value={x}>
                  <Checkbox checked={languageFilter.indexOf(x) > -1} />
                  <ListItemText
                    primary={
                      x +
                      " (" +
                      langRec.native_name +
                      " | " +
                      intl.get("lang." + langRec.name) +
                      ")"
                    }
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </ThemeProvider>
  );
};

export { FilterSelectors };
