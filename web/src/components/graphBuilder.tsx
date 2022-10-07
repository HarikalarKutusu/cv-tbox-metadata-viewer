// i10n
import intl from "react-intl-universal";

// App
import {
  CV_METADATATABLE_TYPE,
  TOTALS_TABLE_TYPE,
} from "../helpers/dataTableHelper";

import { useStore } from "./../stores/store";

// App Charts
import { GRAPH_DATA, GRAPH_VIEW_TYPE } from "../helpers/graphHelper";
import { AppBarChart } from "./graphs/barChart";
import { AppAreaChart } from "./graphs/areaChart";
import { AppLineChart } from "./graphs/lineChart";

import { Alert, Container, Grid, Paper } from '@mui/material';

//
// Graph Builder
//

export const GraphBuilder = () => {
  const { metaData, cvTotals } = useStore();
  const { tableView } = useStore();
  const { versionFilter, languageFilter } = useStore();

  let gEnable: boolean = false;
  let gData: CV_METADATATABLE_TYPE | TOTALS_TABLE_TYPE | undefined = [];
  let viewGraphs: GRAPH_VIEW_TYPE[] = [];
  let gLocales: string[] = [];

  // It firstly depends on if table view is "totals"
  if (tableView === "totals") {
    gEnable = true;
    gData = cvTotals;
    viewGraphs = GRAPH_DATA.filter((row) => row.view == tableView);
    // TODO : Support multiple, up to 5? We need to change graph type thou...
  } else if (
    metaData &&
    languageFilter.length > 0 &&
    languageFilter.length <= 1
  ) {
    gEnable = true;
    // get subsets
    viewGraphs = GRAPH_DATA.filter((row) => row.view == tableView);
    gLocales = languageFilter;
    if (versionFilter.length === 0) {
      gData = metaData.filter((row) => gLocales.includes(row.locale));
    } else {
      gData = metaData.filter(
        (row) =>
          gLocales.includes(row.locale) && versionFilter.includes(row.version),
      );
    }
  }

  const getSeriesNames = (lst: string[]) => {
    let res: string[] = [];
    lst.forEach((s: string) => res.push(intl.get(s)));
    return res;
  };

  return !metaData ? (
    <></>
  ) : !gEnable ? (
    <Alert severity="warning">
      {intl.get("warn.to_view_graphs")}
    </Alert>
  ) : (
    <Container maxWidth={false} style={{ padding: 0 }}>
      <Grid container spacing={1}>
        {/* Loop graphs */}
        {viewGraphs.map((gd, index) => {
          return (
            <Grid item xs={12} sm={12} md={6} key={index}>
              <Paper sx={{ p: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ width: "100%", height: "300px" }}>
                  {/* BAR CHART */}
                  {gd.type === "bar" ? (
                    <AppBarChart
                      data={gData}
                      xKey={gd.xKey}
                      yKeys={gd.yKeys}
                      stacked={gd.stacked}
                      seriesNames={getSeriesNames(gd.seriesNames)}
                    />
                  ) : (
                    <>
                      {gd.type === "area" ? (
                        <AppAreaChart
                          data={gData}
                          xKey={gd.xKey}
                          yKeys={gd.yKeys}
                          stacked={gd.stacked}
                          seriesNames={getSeriesNames(gd.seriesNames)}
                        />
                      ) : (
                        <>
                          {gd.type === "line" ? (
                            <AppLineChart
                              data={gData}
                              xKey={gd.xKey}
                              yKeys={gd.yKeys}
                              seriesNames={getSeriesNames(gd.seriesNames)}
                            />
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};
