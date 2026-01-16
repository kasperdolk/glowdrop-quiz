import React from 'react';

interface FunnelData {
  step_number: number;
  step_name: string;
  visitors: number;
  dropoff_rate: number;
  conversion_rate: number;
}

interface FunnelChartProps {
  data: FunnelData[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  const maxVisitors = Math.max(...data.map(d => d.visitors));

  return (
    <div className="w-full space-y-4">
      <div className="text-lg font-bold text-center mb-6">Conversion Funnel</div>

      <div className="space-y-3">
        {data.map((step, index) => {
          const width = (step.visitors / maxVisitors) * 100;
          const isDropoff = index > 0 && step.dropoff_rate > 20; // Highlight significant dropoffs

          return (
            <div key={step.step_number} className="space-y-2">
              {/* Step info */}
              <div className="flex justify-between items-center text-sm">
                <div className="font-medium">
                  {step.step_number}. {step.step_name}
                </div>
                <div className="text-right">
                  <span className="font-bold">{step.visitors}</span> visitors
                  {step.dropoff_rate > 0 && (
                    <span className={`ml-2 text-xs ${isDropoff ? 'text-red-600' : 'text-gray-500'}`}>
                      (-{step.dropoff_rate}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Funnel bar */}
              <div className="relative">
                <div
                  className="h-8 rounded transition-all duration-300"
                  style={{
                    width: `${width}%`,
                    background: isDropoff
                      ? 'linear-gradient(90deg, #fee2e2, #fecaca)'
                      : `linear-gradient(90deg, #dbeafe, #93c5fd)`,
                    border: isDropoff ? '1px solid #ef4444' : '1px solid #3b82f6'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {step.conversion_rate}%
                  </div>
                </div>

                {/* Dropoff indicator */}
                {isDropoff && (
                  <div className="absolute -right-1 top-0 h-8 w-2 bg-red-500 rounded-r"></div>
                )}
              </div>

              {/* Dropoff arrow for significant drops */}
              {isDropoff && (
                <div className="text-center">
                  <div className="inline-flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    ⚠️ High drop-off ({step.dropoff_rate}%)
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{data[0]?.visitors || 0}</div>
            <div className="text-xs text-gray-600">Started</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data[data.length - 1]?.visitors || 0}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {data[data.length - 1]?.conversion_rate || 0}%
            </div>
            <div className="text-xs text-gray-600">Conversion</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {data.reduce((acc, curr, idx) => {
                return idx > 0 ? acc + curr.dropoff_rate : acc;
              }, 0).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Total Drop-off</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;