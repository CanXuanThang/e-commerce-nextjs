type DashboardDateFilterProps = {
  selectedPeriod: "day" | "week" | "month";
  onPeriodChange: (period: "day" | "week" | "month") => void;
};

const PERIOD_LABELS: Record<string, string> = {
  day: "Theo ngày",
  week: "Theo tuần",
  month: "Theo tháng",
};

export default function DashboardDateFilter({
  selectedPeriod,
  onPeriodChange,
}: DashboardDateFilterProps) {
  const periods: Array<"day" | "week" | "month"> = ["day", "week", "month"];

  return (
    <div className="flex flex-wrap gap-2 rounded-lg bg-slate-100 p-2">
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onPeriodChange(period)}
          className={`rounded-full px-4 py-2 text-[15px] font-medium transition ${
            selectedPeriod === period
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 hover:bg-slate-200"
          }`}
        >
          {PERIOD_LABELS[period]}
        </button>
      ))}
    </div>
  );
}
