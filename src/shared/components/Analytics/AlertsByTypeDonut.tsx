import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

export type AlertsByTypeDatum = {
  type: string;
  label: string;
  value: number;
};

interface AlertsByTypeDonutProps {
  data: AlertsByTypeDatum[];
  colors: Record<string, string>;
}

const RADIAN = Math.PI / 180;

function renderPieLabel({
  cx,
  cy,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  value,
}: PieLabelRenderProps) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#020617"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {value}
    </text>
  );
}

export function AlertsByTypeDonut({ data, colors }: AlertsByTypeDonutProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          contentStyle={{
            backgroundColor: "#020617",
            borderColor: "#1e293b",
            borderRadius: 12,
          }}
          labelStyle={{ color: "#e2e8f0" }}
          itemStyle={{ color: "#e2e8f0" }}
          formatter={(value: number, _name, props) => [
            `${value} alertas`,
            (props?.payload as AlertsByTypeDatum | undefined)?.label,
          ]}
        />
        <Legend />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="55%"
          outerRadius="90%"
          paddingAngle={4}
          stroke="#020617"
          strokeWidth={2}
          labelLine={false}
          label={renderPieLabel}
        >
          {data.map((entry) => (
            <Cell key={entry.type} fill={colors[entry.type] ?? "#22d3ee"} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
