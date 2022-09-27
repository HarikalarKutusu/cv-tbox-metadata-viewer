import AutoSizer from "react-virtualized-auto-sizer";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";

import {
  BarProps,
  XAxisProps,
  YAxisProps,
  CartesianGridProps,
  ReferenceLineProps,
} from "recharts";
import {
  DT_ROW_TYPE,
  CV_METADATATABLE_TYPE,
} from "../../helpers/dataTableHelper";

import { GRAPH_COLORS  } from "../../helpers/graphHelper";
import { useStore } from "../../stores/store";

// const graphColors = ["#1f77b4", "#ff7f0e", "#2ca02c"];

export const AppBarChart = (props: any) => {
  const { data, xKey, yKeys, seriesNames } = props;
  const { langCode } = useStore()
  let i = 0;
  return (
    <AutoSizer>
      {({ width, height }) => (
        <BarChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 20, bottom: 0, left: 25, right: 0 }}
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
            <Bar
              name={seriesNames[i]}
              key={xKey + "-" + yKey}
              dataKey={yKey}
              fill={GRAPH_COLORS[i++]}
            />
          ))}
        </BarChart>
      )}
    </AutoSizer>
  );
};
