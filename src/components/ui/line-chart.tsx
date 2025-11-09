interface LineChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  title: string;
  data: LineChartDataPoint[];
  className?: string;
  height?: number;
  showValues?: boolean;
  formatValue?: (value: number) => string;
}

export function LineChart({ 
  title, 
  data, 
  className = "", 
  height = 300,
  showValues = true,
  formatValue = (value) => value.toLocaleString()
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const valueRange = maxValue - minValue;
  
  const defaultColor = '#3B82F6';

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = valueRange > 0 ? 100 - ((item.value - minValue) / valueRange) * 100 : 50;
    return { x, y, value: item.value, label: item.label };
  });

  // Generate SVG path for the line
  const generatePath = () => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  };

  // Generate area path for fill
  const generateAreaPath = () => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    path += ` L ${points[points.length - 1].x} 100`;
    path += ` L ${points[0].x} 100`;
    path += ' Z';
    
    return path;
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Y-axis grid lines */}
          {[0, 25, 50, 75, 100].map((position) => (
            <g key={position}>
              <line
                x1="0"
                y1={position + '%'}
                x2="100%"
                y2={position + '%'}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x="0"
                y={position + '%'}
                dy="-5"
                className="text-xs fill-gray-400"
                textAnchor="start"
              >
                {formatValue(minValue + (valueRange * (1 - position / 100)))}
              </text>
            </g>
          ))}
          
          {/* Area fill */}
          <path
            d={generateAreaPath()}
            fill="url(#areaGradient)"
            fillOpacity="0.2"
          />
          
          {/* Line */}
          <path
            d={generatePath()}
            fill="none"
            stroke={data[0]?.color || defaultColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x + '%'}
                cy={point.y + '%'}
                r="4"
                fill={data[index]?.color || defaultColor}
                stroke="#1F2937"
                strokeWidth="2"
                className="cursor-pointer hover:r-6 transition-all"
              />
              
              {/* Value tooltip on hover */}
              <title>
                {point.label}: {formatValue(point.value)}
              </title>
            </g>
          ))}
          
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={data[0]?.color || defaultColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={data[0]?.color || defaultColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="text-xs text-gray-400 text-center transform -rotate-45 origin-top-left"
              style={{ 
                marginLeft: index === 0 ? '0.5rem' : '0',
                marginRight: index === data.length - 1 ? '0.5rem' : '0'
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}