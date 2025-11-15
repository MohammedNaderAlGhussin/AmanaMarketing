interface CardMetricProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function CardMetric({
  title,
  value,
  icon,
  className,
  gradient,
}: CardMetricProps) {
  return (
    <div className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl overflow-hidden">
      {/* Gradient Accent */}
      {gradient && (
        <div
          className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}
        ></div>
      )}

      {/* Icon with Gradient Background */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${
            gradient || "from-gray-700 to-gray-600"
          } shadow-lg`}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>

      {/* Content */}
      <div>
        <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
        <p className={`text-3xl font-bold ${className || "text-white"}`}>
          {value}
        </p>
      </div>

      {/* Hover Effect Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          gradient || "from-blue-500 to-purple-500"
        } opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>
    </div>
  );
}
