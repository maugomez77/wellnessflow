import { useEffect, useState } from "react";
import api from "../lib/api";
import StatusBadge from "../components/ui/StatusBadge";

const SERVICE_COLORS: Record<string, string> = {
  massage: "border-l-teal-500",
  acupuncture: "border-l-purple-500",
  nutrition: "border-l-amber-500",
  chiropractic: "border-l-blue-500",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Appointment {
  id: string;
  client_id: string;
  client_name: string;
  service_type: string;
  service_category: string;
  date: string;
  time: string;
  duration_minutes: number;
  status: string;
  price: number;
  notes?: string;
}

interface CalendarData {
  start_date: string;
  end_date: string;
  days: Record<string, Appointment[]>;
}

export default function AppointmentsPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [allAppts, setAllAppts] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/appointments/calendar"),
      api.get("/api/appointments"),
    ]).then(([calRes, listRes]) => {
      setCalendar(calRes.data);
      setAllAppts(listRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredAppts = statusFilter
    ? allAppts.filter((a) => a.status === statusFilter)
    : allAppts;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">{allAppts.length} total appointments</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView("calendar")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                view === "calendar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                view === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-4 mb-6 text-sm">
        {Object.entries(SERVICE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color.replace("border-l-", "bg-")}`} />
            <span className="capitalize text-gray-600">{type}</span>
          </div>
        ))}
      </div>

      {view === "calendar" && calendar ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-medium text-gray-700">
              Week of {calendar.start_date} to {calendar.end_date}
            </p>
          </div>
          <div className="grid grid-cols-7 divide-x divide-gray-100">
            {Object.entries(calendar.days).map(([dateStr, apts], idx) => (
              <div key={dateStr} className="min-h-[300px]">
                <div className="px-3 py-2 text-center border-b border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500">{DAYS[idx]}</p>
                  <p className="text-sm font-semibold text-gray-900">{dateStr.slice(8)}</p>
                </div>
                <div className="p-2 space-y-1.5">
                  {apts.map((apt) => (
                    <div
                      key={apt.id}
                      className={`border-l-3 ${SERVICE_COLORS[apt.service_category] || "border-l-gray-300"} bg-gray-50 rounded-r-md px-2 py-1.5 text-xs`}
                    >
                      <p className="font-medium text-gray-900 truncate">{apt.client_name}</p>
                      <p className="text-gray-500">{apt.time}</p>
                      <p className="text-gray-400 truncate">{apt.service_type}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Status filter */}
          <div className="flex gap-2 mb-4">
            {["", "scheduled", "completed", "cancelled", "no_show"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  statusFilter === s
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s ? s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase()) : "All"}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppts.map((apt) => (
                  <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{apt.client_name}</td>
                    <td className="px-5 py-3 text-gray-600">{apt.service_type}</td>
                    <td className="px-5 py-3 text-gray-600">{apt.date}</td>
                    <td className="px-5 py-3 text-gray-600">{apt.time}</td>
                    <td className="px-5 py-3 text-gray-600">{apt.duration_minutes}min</td>
                    <td className="px-5 py-3 text-gray-600">${apt.price}</td>
                    <td className="px-5 py-3"><StatusBadge status={apt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
