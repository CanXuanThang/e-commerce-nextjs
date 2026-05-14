import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { addCommas, formatMonthLabel } from "@/utils";

type TopProduct = {
  name: string;
  quantity: number;
  revenue: number;
};

type MonthlyRevenue = {
  monthDate: string;
  revenue: number;
};

type DashboardChartsProps = {
  topProducts: TopProduct[];
  monthlyRevenue: MonthlyRevenue[];
  labels: {
    topProducts: string;
    monthlyRevenue: string;
  };
  currency: string;
  productsUnit: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function DashboardCharts({
  topProducts,
  monthlyRevenue,
  labels,
  currency,
  productsUnit,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-[15px] font-semibold mb-4">{labels.topProducts}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topProducts}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="quantity"
            >
              {topProducts.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props: any) => [
                `${addCommas(String(props.payload.quantity))} ${productsUnit}, ${addCommas(String(props.payload.revenue))} ${currency}`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-[15px] font-semibold mb-4">
          {labels.monthlyRevenue}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="monthDate"
              tick={{ fontSize: 15 }}
              tickFormatter={(value) => formatMonthLabel(String(value))}
            />
            <YAxis tick={{ fontSize: 15 }} />
            <Tooltip
              wrapperStyle={{ fontSize: 15 }}
              labelStyle={{ fontSize: 15 }}
              itemStyle={{ fontSize: 15 }}
              formatter={(value) => [
                `${addCommas(String(value))} ${currency}`,
                labels.monthlyRevenue,
              ]}
              labelFormatter={(value) => formatMonthLabel(String(value))}
            />
            <Legend wrapperStyle={{ fontSize: 15 }} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
