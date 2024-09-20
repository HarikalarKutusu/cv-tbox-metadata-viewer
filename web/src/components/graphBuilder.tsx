// react
import { useEffect, useState } from "react";
// i10n
import intl from "react-intl-universal";
// MUI
import { Alert, Container, Grid, Paper } from "@mui/material";

// App
import { useStore } from "./../stores/store";

import {
  CV_METADATATABLE_TYPE,
  TOTALS_TABLE_TYPE,
  DELTA_TABLE_TYPE,
  getCVLanguageRecord,
} from "../helpers/dataTableHelper";

// App Charts
import { GRAPH_DATA, GRAPH_VIEW_TYPE } from "../helpers/graphHelper";
import { AppBarChart } from "./graphs/barChart";
import { AppAreaChart } from "./graphs/areaChart";
import { AppLineChart } from "./graphs/lineChart";

//
// Graph Builder
//

export const GraphBuilder = () => {
  const { initDone } = useStore();
  const { metaData, cvTotals, cvDelta } = useStore();
  const { tableView } = useStore();
  const { versionFilter, languageFilter } = useStore();

  const [gEnable, setGEnable] = useState<boolean>(false);
  const [gData, setGData] = useState<
    CV_METADATATABLE_TYPE | TOTALS_TABLE_TYPE | DELTA_TABLE_TYPE
  >();
  const [viewGraphs, setViewGraphs] = useState<GRAPH_VIEW_TYPE[]>();

  const getSeriesNames = (lst: string[]) => {
    let res: string[] = [];
    lst.forEach((s: string) => res.push(intl.get(s)));
    return res;
  };

  // get graph data for this view
  useEffect(() => {
    setViewGraphs(GRAPH_DATA.filter((row) => row.view === tableView));
  }, [tableView, setViewGraphs]);

  useEffect(() => {
    // It firstly depends on if table view is "totals"
    if (cvTotals && tableView === "totals") {
      setGEnable(true);
      setGData(cvTotals);
    } else if (
      cvDelta &&
      tableView === "delta" &&
      languageFilter.length === 1
    ) {
      setGEnable(true);
      setGData(cvDelta.filter((row) => languageFilter.includes(row.locale)));
    } else if (
      metaData &&
      languageFilter.length > 0 &&
      languageFilter.length <= 1
    ) {
      setGEnable(true);
      if (versionFilter.length === 0) {
        setGData(metaData.filter((row) => languageFilter.includes(row.locale)));
      } else {
        const tempGData = metaData.filter(
          (row) =>
            languageFilter.includes(row.locale) &&
            versionFilter.includes(row.version),
        );
        setGData(tempGData);
      }
    } else {
      setGEnable(false);
    }
  }, [
    cvTotals,
    languageFilter,
    metaData,
    tableView,
    versionFilter,
    viewGraphs, // keep this for fix to intl not rendering correcty
  ]);

  let lc: string = "";
  let native_name_post: string = "";

  if (gEnable && languageFilter.length === 1) {
    lc = languageFilter[0];
    native_name_post = " (" + getCVLanguageRecord(lc).native_name + ")";
  }

  // if it is text-corpus realated, the info starts with v17.0
  let gdTCFilter: boolean = false;

  return !metaData || !initDone || !viewGraphs ? (
    <>...</>
  ) : !gEnable ? (
    <Alert severity="warning">{intl.get("warn.to_view_graphs")}</Alert>
  ) : (
    <Container maxWidth={false} style={{ padding: 0 }}>
      <Grid container spacing={1}>
        {/* Loop graphs */}
        {viewGraphs.map((gd, index) => {
          return (
            <Grid item xs={12} sm={12} md={6} key={index}>
              <Paper sx={{ p: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ width: "100%", height: "300px" }}>
                  {gd.yKeys[0].slice(0, 3) === "tc_" ||
                  gd.yKeys[0].slice(0, 3) === "sd_"
                    ? (gdTCFilter = true)
                    : (gdTCFilter = false)}
                  {/* BAR CHART */}
                  {gd.type === "bar" ? (
                    <AppBarChart
                      data={
                        gdTCFilter
                          ? ((gData! as TOTALS_TABLE_TYPE).filter(
                              (row) => Number(row.version) >= 17.0,
                            ) as TOTALS_TABLE_TYPE)
                          : gData!
                      }
                      xKey={gd.xKey}
                      yKeys={gd.yKeys}
                      stacked={gd.stacked}
                      seriesNames={getSeriesNames(gd.seriesNames)}
                      title={
                        gd.title
                          ? intl.get(gd.title)
                          : "Common Voice - " + lc + native_name_post
                      }
                      subTitle={gd.subTitle ? intl.get(gd.subTitle) : undefined}
                      fillPercent={gd.fillPercent}
                      cnt={index}
                    />
                  ) : (
                    <>
                      {gd.type === "area" ? (
                        <AppAreaChart
                          data={
                            gdTCFilter
                              ? ((gData! as TOTALS_TABLE_TYPE).filter(
                                  (row) => Number(row.version) >= 17.0,
                                ) as TOTALS_TABLE_TYPE)
                              : gData!
                          }
                          xKey={gd.xKey}
                          yKeys={gd.yKeys}
                          stacked={gd.stacked}
                          seriesNames={getSeriesNames(gd.seriesNames)}
                          title={
                            gd.title
                              ? intl.get(gd.title)
                              : "Common Voice - " + lc + native_name_post
                          }
                          subTitle={
                            gd.subTitle ? intl.get(gd.subTitle) : undefined
                          }
                          fillPercent={gd.fillPercent}
                          cnt={index}
                        />
                      ) : (
                        <>
                          {gd.type === "line" ? (
                            <AppLineChart
                              data={
                                gdTCFilter
                                  ? ((gData! as TOTALS_TABLE_TYPE).filter(
                                      (row) => Number(row.version) >= 17.0,
                                    ) as TOTALS_TABLE_TYPE)
                                  : gData!
                              }
                              xKey={gd.xKey}
                              yKeys={gd.yKeys}
                              seriesNames={getSeriesNames(gd.seriesNames)}
                              title={
                                gd.title
                                  ? intl.get(gd.title)
                                  : "Common Voice - " + lc + native_name_post
                              }
                              subTitle={
                                gd.subTitle ? intl.get(gd.subTitle) : undefined
                              }
                              fillPercent={gd.fillPercent}
                              cnt={index}
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
