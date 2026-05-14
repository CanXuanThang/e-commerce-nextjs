type DashboardStatsProps = {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProductsSold: number;
  };
  labels: {
    revenue: string;
    orders: string;
    products: string;
  };
  currency: string;
};

export default function DashboardStats({
  stats,
  labels,
  currency,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-sky-50 text-slate-900 p-4 rounded-lg shadow border border-sky-200">
        <h3 className="text-[15px] font-semibold">{labels.revenue}</h3>
        <p className="text-[15px] font-bold">
          {stats.totalRevenue.toLocaleString()} {currency}
        </p>
      </div>
      <div className="bg-emerald-50 text-slate-900 p-4 rounded-lg shadow border border-emerald-200">
        <h3 className="text-[15px] font-semibold">{labels.orders}</h3>
        <p className="text-[15px] font-bold">{stats.totalOrders}</p>
      </div>
      <div className="bg-violet-50 text-slate-900 p-4 rounded-lg shadow border border-violet-200">
        <h3 className="text-[15px] font-semibold">{labels.products}</h3>
        <p className="text-[15px] font-bold">{stats.totalProductsSold}</p>
      </div>
    </div>
  );
}
