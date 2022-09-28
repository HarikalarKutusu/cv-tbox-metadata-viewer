import AutoSizer from "react-virtualized-auto-sizer";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // ReferenceLine,
  Legend,
} from "recharts";

// import {
//   AreaProps,
//   XAxisProps,
//   YAxisProps,
//   CartesianGridProps,
//   ReferenceLineProps,
// } from "recharts";

import { GRAPH_COLORS } from "../../helpers/graphHelper";
import { useStore } from "../../stores/store";

export const AppAreaChart = (props: any) => {
  const { data, xKey, yKeys, seriesNames, stacked } = props;
  const { langCode } = useStore();
  let i = 0;

  return (
    <AutoSizer>
      {({ width, height }) => (
        <AreaChart
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
          {yKeys.length > 1 && stacked
            ? yKeys.map((yKey: string) => (
                <Area
                  name={seriesNames[i]}
                  key={xKey + "-" + yKey}
                  stackId="a"
                  dataKey={yKey}
                  fill={GRAPH_COLORS[i]}
                  stroke={GRAPH_COLORS[i++]}
                />
              ))
            : yKeys.map((yKey: string) => (
                <Area
                  name={seriesNames[i]}
                  key={xKey + "-" + yKey}
                  dataKey={yKey}
                  fill={GRAPH_COLORS[i]}
                  stroke={GRAPH_COLORS[i++]}
                />
              ))}
        </AreaChart>
      )}
    </AutoSizer>
  );
};
