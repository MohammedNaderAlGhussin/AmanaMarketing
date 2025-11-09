interface BubbleMapDataPoint {
  region: string;
  country: string;
  value: number;
  revenue?: number;
  spend?: number;
  latitude?: number;
  longitude?: number;
}

interface BubbleMapProps {
  title: string;
  data: BubbleMapDataPoint[];
  className?: string;
  height?: number;
  formatValue?: (value: number) => string;
  valueType?: 'revenue' | 'spend' | 'value';
}

// GCC region coordinates
const regionCoordinates: { [key: string]: { latitude: number; longitude: number } } = {
  'Abu Dhabi': { latitude: 24.4539, longitude: 54.3773 },
  'Dubai': { latitude: 25.2048, longitude: 55.2708 },
  'Sharjah': { latitude: 25.3463, longitude: 55.4209 },
  'Riyadh': { latitude: 24.7136, longitude: 46.6753 },
  'Doha': { latitude: 25.2854, longitude: 51.5310 },
  'Kuwait City': { latitude: 29.3759, longitude: 47.9774 },
  'Manama': { latitude: 26.2285, longitude: 50.5860 }
};

export function BubbleMap({ 
  title, 
  data, 
  className = "", 
  height = 400,
  formatValue = (value) => value.toLocaleString(),
  valueType = 'value'
}: BubbleMapProps) {
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

  // Calculate bubble sizes
  const values = data.map(item => item.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valueRange = maxValue - minValue;

  // Get value for display
  const getDisplayValue = (item: BubbleMapDataPoint) => {
    switch (valueType) {
      case 'revenue': return item.revenue || item.value;
      case 'spend': return item.spend || item.value;
      default: return item.value;
    }
  };

  // Calculate bubble size (10px to 80px)
  const calculateBubbleSize = (value: number) => {
    if (valueRange === 0) return 40;
    const normalized = (value - minValue) / valueRange;
    return 20 + normalized * 60;
  };

  // Get bubble color based on value
  const getBubbleColor = (value: number) => {
    const normalized = valueRange > 0 ? (value - minValue) / valueRange : 0.5;
    
    if (valueType === 'spend') {
      // Red to yellow gradient for spend
      if (normalized < 0.5) {
        return `rgb(239, 68, 68)`; // red-500
      } else {
        return `rgb(245, 158, 11)`; // amber-500
      }
    } else {
      // Green gradient for revenue/value
      if (normalized < 0.5) {
        return `rgb(34, 197, 94)`; // green-500
      } else {
        return `rgb(22, 163, 74)`; // green-600
      }
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      
      <div 
        className="relative bg-gray-900 rounded-lg border border-gray-700 overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {/* GCC Region Map Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-700 text-center">
            <div className="text-sm mb-2">GCC Region</div>
            <div className="text-xs text-gray-600">Arabian Peninsula</div>
          </div>
        </div>

        {/* Bubbles */}
        {data.map((item, index) => {
          const coordinates = regionCoordinates[item.region] || { latitude: 25, longitude: 50 };
          const displayValue = getDisplayValue(item);
          const bubbleSize = calculateBubbleSize(displayValue);
          const bubbleColor = getBubbleColor(displayValue);
          
          // Convert coordinates to relative positioning (simplified for GCC region)
          const x = 20 + ((coordinates.longitude - 45) / 15) * 60; // 45-60 longitude range
          const y = 20 + ((coordinates.latitude - 22) / 8) * 60;   // 22-30 latitude range

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${bubbleSize}px`,
                height: `${bubbleSize}px`,
              }}
            >
              {/* Bubble */}
              <div
                className="w-full h-full rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: bubbleColor,
                  opacity: 0.8,
                }}
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap border border-gray-700 shadow-lg">
                  <div className="font-semibold">{item.region}</div>
                  <div className="text-gray-300">
                    {valueType === 'revenue' && `Revenue: $${formatValue(displayValue)}`}
                    {valueType === 'spend' && `Spend: $${formatValue(displayValue)}`}
                    {valueType === 'value' && `Value: ${formatValue(displayValue)}`}
                  </div>
                  {item.country && (
                    <div className="text-gray-400 text-xs">{item.country}</div>
                  )}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
              
              {/* Region Label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white font-medium whitespace-nowrap">
                {item.region}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-300 font-semibold mb-2">Bubble Size</div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Small</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 rounded-full bg-green-500" />
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 rounded-full bg-green-500" />
              <span>Large</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}