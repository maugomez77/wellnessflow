const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-600",
  no_show: "bg-red-100 text-red-700",
  submitted: "bg-yellow-100 text-yellow-700",
  under_review: "bg-orange-100 text-orange-700",
  approved: "bg-teal-100 text-teal-700",
  paid: "bg-emerald-100 text-emerald-700",
  denied: "bg-red-100 text-red-700",
  current: "bg-emerald-100 text-emerald-700",
  expiring_soon: "bg-amber-100 text-amber-700",
  expired: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  paid: "Paid",
  denied: "Denied",
  current: "Current",
  expiring_soon: "Expiring Soon",
  expired: "Expired",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColors[status] || "bg-gray-100 text-gray-700";
  const label = statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
