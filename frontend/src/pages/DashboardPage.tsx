import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "../lib/api";
import KpiCard from "../components/ui/KpiCard";
import StatusBadge from "../components/ui/StatusBadge";

const PIE_COLORS = ["#0d9488", "#14b8a6", "#5eead4", "#99f6e4", "#f59e0b"];

interface DashboardData {
  monthly_revenue: number;
  total_clients: number;
  appointments_this_week: number;
  insurance_claims_pending: number;
  revenue_by_month: { month: string; revenue: number }[];
  appointments_by_type: { type: string; count: number }[];
  client_retention_rate: number;
  upcoming_appointments: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/dashboard").then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (!data) return <p className="text-gray-500">Failed to load dashboard.</p>;

  const revenueData = data.revenue_by_month.map((r) => ({
    month: r.month.slice(5),
    revenue: r.revenue,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Dr. Sarah Chen</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard
          title="Monthly Revenue"
          value={`$${data.monthly_revenue.toLocaleString()}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend={{ value: 8.2, positive: true }}
        />
        <KpiCard
          title="Total Clients"
          value={data.total_clients}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          subtitle={`${data.client_retention_rate}% retention`}
        />
        <KpiCard
          title="This Week"
          value={data.appointments_this_week}
          subtitle="Appointments"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <KpiCard
          title="Pending Claims"
          value={data.insurance_claims_pending}
          subtitle="Awaiting response"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue (12 months)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments by type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">By Service Type</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.appointments_by_type}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={3}
              >
                {data.appointments_by_type.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value: string) => <span className="capitalize text-gray-600">{value}</span>}
              />
              <Tooltip formatter={(value: number) => [value, "Sessions"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.upcoming_appointments.map((apt: any) => (
                <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-900">{apt.client_name}</td>
                  <td className="py-3 text-gray-600">{apt.service_type}</td>
                  <td className="py-3 text-gray-600">{apt.date}</td>
                  <td className="py-3 text-gray-600">{apt.time}</td>
                  <td className="py-3"><StatusBadge status={apt.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
