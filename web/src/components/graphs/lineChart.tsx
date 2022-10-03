import AutoSizer from "react-virtualized-auto-sizer";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // ReferenceLine,
  Legend,
} from "recharts";

// import {
//   LineProps,
//   XAxisProps,
//   YAxisProps,
//   CartesianGridProps,
//   ReferenceLineProps,
// } from "recharts";

import { GRAPH_COLORS } from "../../helpers/graphHelper";
import { useStore } from "../../stores/store";

export const AppLineChart = (props: any) => {
  const { data, xKey, yKeys, seriesNames } = props;
  const { langCode } = useStore();
  let i = 0;

  return (
    <AutoSizer>
      {({ width, height }) => (
        <LineChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 20, bottom: 0, left: 25, right: 10 }}
        >
          <XAxis
            dataKey={xKey}
            style={{
              fontSize: "0.8rem",
              fontFamily: "Arial",
            }}
          />
          <YAxis
            dataKey={yKeys[0]}
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
          <Legend />
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
      )}
    </AutoSizer>
  );
};