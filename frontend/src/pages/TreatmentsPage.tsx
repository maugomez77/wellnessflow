import { useEffect, useState } from "react";
import api from "../lib/api";
import ProgressBar from "../components/ui/ProgressBar";

interface TreatmentPlan {
  id: string;
  client_id: string;
  client_name: string;
  plan_type: string;
  condition: string;
  total_sessions: number;
  completed_sessions: number;
  start_date: string;
  next_session: string | null;
  goals: string[];
  notes: string | null;
}

export default function TreatmentsPage() {
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get("/api/treatments").then((res) => {
      setPlans(res.data);
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Treatment Plans</h1>
        <p className="text-gray-500 text-sm mt-1">{plans.length} active treatment plans</p>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => {
          const pct = Math.round((plan.completed_sessions / plan.total_sessions) * 100);
          const isExpanded = expanded === plan.id;

          return (
            <div
              key={plan.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : plan.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.client_name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{plan.plan_type} — {plan.condition}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${
                      pct === 100 ? "text-emerald-600" : pct >= 50 ? "text-teal-600" : "text-amber-600"
                    }`}>
                      {pct}%
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <ProgressBar completed={plan.completed_sessions} total={plan.total_sessions} />

                <div className="flex items-center gap-6 mt-3 text-xs text-gray-500">
                  <span>Started: {plan.start_date}</span>
                  {plan.next_session && <span>Next session: {plan.next_session}</span>}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  {/* Goals */}
                  {plan.goals.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Goals</p>
                      <ul className="space-y-1.5">
                        {plan.goals.map((goal, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                            </svg>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Notes */}
                  {plan.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Progress Notes</p>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{plan.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
