// import { memo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // ReferenceLine,
  Legend,
} from "recharts";

import { GRAPH_COLORS } from "../../helpers/graphHelper";
import { useStore } from "../../stores/store";

export const AppBarChart = (props: any) => {
  const { data, xKey, yKeys, seriesNames, stacked } = props;
  const { langCode } = useStore();
  let i = 0;

  return (
    <AutoSizer>
      {({ width, height }) => (
        <BarChart
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
                <Bar
                  name={seriesNames[i]}
                  key={xKey + "-" + yKey}
                  stackId="a"
                  dataKey={yKey}
                  fill={GRAPH_COLORS[i++ % GRAPH_COLORS.length]}
                />
              ))
            : yKeys.map((yKey: string) => (
                <Bar
                  name={seriesNames[i]}
                  key={xKey + "-" + yKey}
                  dataKey={yKey}
                  fill={GRAPH_COLORS[i++ % GRAPH_COLORS.length]}
                />
              ))}
        </BarChart>
      )}
    </AutoSizer>
  );
};
