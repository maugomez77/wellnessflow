import { useEffect, useState } from "react";
import api from "../lib/api";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  intake_date: string;
  conditions: string[];
  insurance_provider: string | null;
  last_visit: string | null;
  total_appointments: number;
}

interface ClientDetail extends Client {
  date_of_birth: string | null;
  insurance_id: string | null;
  notes: string | null;
  appointments: any[];
  treatment_plans: any[];
  insurance_claims: any[];
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ClientDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = (q?: string) => {
    setLoading(true);
    const params = q ? { search: q } : {};
    api.get("/api/clients", { params }).then((res) => {
      setClients(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadClients(search);
  };

  const viewClient = (id: string) => {
    setDetailLoading(true);
    api.get(`/api/clients/${id}`).then((res) => {
      setSelected(res.data);
      setDetailLoading(false);
    }).catch(() => setDetailLoading(false));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} total clients</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 max-w-md px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); loadClients(); }}
              className="text-gray-500 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="flex gap-6">
        {/* Client list */}
        <div className={`${selected ? "w-1/2" : "w-full"} transition-all`}>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Conditions</th>
                    <th className="px-5 py-3 font-medium">Last Visit</th>
                    <th className="px-5 py-3 font-medium">Insurance</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => viewClient(c.id)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors ${
                        selected?.id === c.id ? "bg-teal-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{c.first_name} {c.last_name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.conditions.slice(0, 2).map((cond) => (
                            <span key={cond} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                              {cond}
                            </span>
                          ))}
                          {c.conditions.length > 2 && (
                            <span className="text-xs text-gray-400">+{c.conditions.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{c.last_visit || "—"}</td>
                      <td className="px-5 py-3">
                        {c.insurance_provider ? (
                          <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded">
                            {c.insurance_provider}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Self-pay</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Client detail panel */}
        {selected && (
          <div className="w-1/2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              {detailLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selected.first_name} {selected.last_name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">{selected.email} | {selected.phone}</p>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <p className="text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900">{selected.date_of_birth || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Intake Date</p>
                      <p className="font-medium text-gray-900">{selected.intake_date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Insurance</p>
                      <p className="font-medium text-gray-900">
                        {selected.insurance_provider || "Self-pay"}
                        {selected.insurance_id && <span className="text-gray-400 ml-1">({selected.insurance_id})</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Appointments</p>
                      <p className="font-medium text-gray-900">{selected.appointments?.length || 0} total</p>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.conditions.map((c) => (
                        <span key={c} className="bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-lg">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {selected.notes && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selected.notes}</p>
                    </div>
                  )}

                  {/* Recent appointments */}
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-3">Recent Appointments</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selected.appointments?.slice(0, 5).map((apt: any) => (
                        <div key={apt.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                          <div>
                            <p className="font-medium text-gray-900">{apt.service_type}</p>
                            <p className="text-xs text-gray-500">{apt.date} at {apt.time}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            apt.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                            apt.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Plans */}
                  {selected.treatment_plans && selected.treatment_plans.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-900 mb-3">Treatment Plans</p>
                      {selected.treatment_plans.map((tp: any) => (
                        <div key={tp.id} className="bg-gray-50 rounded-lg px-3 py-2 text-sm mb-2">
                          <p className="font-medium text-gray-900">{tp.plan_type}</p>
                          <p className="text-xs text-gray-500">{tp.condition}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-teal-500 h-1.5 rounded-full"
                                style={{ width: `${(tp.completed_sessions / tp.total_sessions) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{tp.completed_sessions}/{tp.total_sessions}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
