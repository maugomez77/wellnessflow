import { useEffect, useState } from "react";
import api from "../lib/api";
import StatusBadge from "../components/ui/StatusBadge";

interface Claim {
  id: string;
  client_name: string;
  service_type: string;
  date_of_service: string;
  amount: number;
  insurance_provider: string;
  status: string;
  submitted_date: string;
  paid_date?: string;
  paid_amount?: number;
  denial_reason?: string;
}

interface Summary {
  total_submitted: number;
  total_paid: number;
  pending_count: number;
  paid_count: number;
  denied_count: number;
  approved_count: number;
  success_rate: number;
}

const PIPELINE_STAGES = [
  { key: "submitted", label: "Submitted", color: "bg-yellow-400" },
  { key: "under_review", label: "Under Review", color: "bg-orange-400" },
  { key: "approved", label: "Approved", color: "bg-teal-400" },
  { key: "paid", label: "Paid", color: "bg-emerald-500" },
];

export default function InsurancePage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/insurance/claims").then((res) => {
      setClaims(res.data.claims);
      setSummary(res.data.summary);
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
        <h1 className="text-2xl font-bold text-gray-900">Insurance Claims</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage insurance reimbursements</p>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Total Submitted</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${summary.total_submitted.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">${summary.total_paid.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Pending Claims</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{summary.pending_count}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold text-teal-600 mt-1">{summary.success_rate}%</p>
          </div>
        </div>
      )}

      {/* Pipeline visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Claims Pipeline</h2>
        <div className="flex items-center gap-2">
          {PIPELINE_STAGES.map((stage, idx) => {
            const count = claims.filter((c) => c.status === stage.key).length;
            return (
              <div key={stage.key} className="flex-1 flex items-center">
                <div className="flex-1 text-center">
                  <div className={`${stage.color} text-white rounded-lg py-3 px-2`}>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs font-medium opacity-90">{stage.label}</p>
                  </div>
                </div>
                {idx < PIPELINE_STAGES.length - 1 && (
                  <svg className="w-6 h-6 text-gray-300 mx-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            );
          })}
          {/* Denied */}
          <div className="flex-1 text-center">
            <div className="bg-red-400 text-white rounded-lg py-3 px-2">
              <p className="text-2xl font-bold">{claims.filter((c) => c.status === "denied").length}</p>
              <p className="text-xs font-medium opacity-90">Denied</p>
            </div>
          </div>
        </div>
      </div>

      {/* Claims table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Provider</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Submitted</th>
              <th className="px-5 py-3 font-medium">Paid</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{claim.client_name}</td>
                <td className="px-5 py-3 text-gray-600">{claim.service_type}</td>
                <td className="px-5 py-3 text-gray-600">{claim.insurance_provider}</td>
                <td className="px-5 py-3 text-gray-900 font-medium">${claim.amount}</td>
                <td className="px-5 py-3 text-gray-600">{claim.submitted_date}</td>
                <td className="px-5 py-3 text-gray-600">
                  {claim.paid_amount ? (
                    <span className="text-emerald-600 font-medium">${claim.paid_amount}</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-3"><StatusBadge status={claim.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
