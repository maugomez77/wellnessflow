import { useEffect, useState } from "react";
import api from "../lib/api";
import StatusBadge from "../components/ui/StatusBadge";

interface ComplianceItem {
  id: string;
  name: string;
  category: string;
  status: string;
  issue_date: string;
  expiry_date: string;
  notes: string | null;
}

interface ComplianceSummary {
  total: number;
  current: number;
  expiring_soon: number;
  expired: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  Training: "bg-blue-50 text-blue-600",
  Certification: "bg-purple-50 text-purple-600",
  License: "bg-teal-50 text-teal-600",
  Insurance: "bg-amber-50 text-amber-600",
  Permit: "bg-emerald-50 text-emerald-600",
};

export default function CompliancePage() {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [summary, setSummary] = useState<ComplianceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/compliance").then((res) => {
      setItems(res.data.items);
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

  const daysUntilExpiry = (dateStr: string) => {
    const now = new Date();
    const exp = new Date(dateStr);
    const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Licenses, certifications, and training status</p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Current</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.current}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Expiring Soon</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{summary.expiring_soon}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Expired</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{summary.expired}</p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => {
          const days = daysUntilExpiry(item.expiry_date);
          const catColor = CATEGORY_ICONS[item.category] || "bg-gray-50 text-gray-600";

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-sm border p-5 ${
                item.status === "expiring_soon"
                  ? "border-amber-200"
                  : item.status === "expired"
                  ? "border-red-200"
                  : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${catColor}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{item.category}</p>
                    {item.notes && (
                      <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <StatusBadge status={item.status} />
                  <p className="text-xs text-gray-500 mt-2">
                    Expires: {item.expiry_date}
                  </p>
                  {item.status !== "expired" && (
                    <p className={`text-xs font-medium mt-1 ${
                      days <= 30 ? "text-amber-600" : days <= 90 ? "text-yellow-600" : "text-gray-400"
                    }`}>
                      {days > 0 ? `${days} days remaining` : "Expired"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-xs text-gray-500 border-t border-gray-50 pt-3">
                <span>Issued: {item.issue_date}</span>
                <span>Expires: {item.expiry_date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
