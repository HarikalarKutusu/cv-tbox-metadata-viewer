// React
import { useCallback } from "react";
// MUI
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
// Charts
import AutoSizer from "react-virtualized-auto-sizer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  // ReferenceLine,
  // Label,
} from "recharts";
// Saving
import FileSaver from "file-saver";
import { useCurrentPng } from "recharts-to-png";
// App
import { GRAPH_COLORS } from "../../helpers/graphHelper";
import { useStore } from "../../stores/store";
import { cleanFn } from "../../helpers/appHelper";

export const AppLineChart = (props: any) => {
  const { data, xKey, yKeys, seriesNames, title, subTitle } = props;
  const { langCode } = useStore();
  const [getPng, { ref: refLine, isLoading }] = useCurrentPng();

  let i = 0;

  const handleLineDownload = useCallback(async () => {
    if (isLoading) return;
    console.log("here");
    const png = await getPng();
    if (png) {
      FileSaver.saveAs(png, cleanFn(title + "-" + subTitle + ".png"));
    }
  }, [getPng, isLoading, subTitle, title]);

  const DLIcon = () => {
    return (
      <DownloadForOfflineIcon color="secondary" onClick={handleLineDownload} />
    );
  };

  return (
    <AutoSizer>
      {({ width, height }) => (
        <div style={{ position: "relative" }}>
          <LineChart
            width={width}
            height={height}
            data={data}
            margin={{ top: 50, bottom: 0, left: 25, right: 10 }}
            ref={refLine}
          >
            <XAxis
              dataKey={xKey}
              style={{
                fontSize: "0.8rem",
                fontFamily: "Arial",
              }}
            />
            <YAxis
              style={{
                fontSize: "0.8rem",
                fontFamily: "Arial",
              }}
              tickFormatter={(val) => {
                return val.toLocaleString(langCode);
              }}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <Tooltip
              formatter={(val) => {
                return val.toLocaleString(langCode);
              }}
            />
            {yKeys && yKeys.length !== 1 ? <Legend /> : <></>}
            {title ? (
              <text
                x={width / 2}
                y={10}
                fill="#999"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="1.1rem"
                fontWeight={500}
              >
                {title}
              </text>
            ) : (
              <></>
            )}
            {subTitle ? (
              <text
                x={width / 2}
                y={30}
                fill="#666"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="0.9rem"
                fontWeight={400}
              >
                {subTitle}
              </text>
            ) : (
              <></>
            )}
            {yKeys.map((yKey: string) => (
              <Line
                name={seriesNames[i]}
                key={xKey + "-" + yKey}
                dataKey={yKey}
                // fill={GRAPH_COLORS[i]}
                stroke={GRAPH_COLORS[i++]}
              />
            ))}
          </LineChart>
          <div
            style={{ position: "absolute", top: -5, left: -5 }}
            onClick={handleLineDownload}
          >
            <DLIcon />
          </div>
        </div>
      )}
    </AutoSizer>
  );
};
