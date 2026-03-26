interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
}

export default function KpiCard({ title, value, subtitle, icon, trend }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <p className={`mt-1 text-sm font-medium ${trend.positive ? "text-emerald-600" : "text-red-500"}`}>
              {trend.positive ? "+" : ""}{trend.value}% vs last month
            </p>
          )}
        </div>
        <div className="p-3 bg-teal-50 rounded-lg text-teal-600">{icon}</div>
      </div>
    </div>
  );
}
