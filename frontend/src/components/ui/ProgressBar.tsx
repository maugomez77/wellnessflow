interface ProgressBarProps {
  completed: number;
  total: number;
  showLabel?: boolean;
}

export default function ProgressBar({ completed, total, showLabel = true }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
          {completed}/{total}
        </span>
      )}
    </div>
  );
}
