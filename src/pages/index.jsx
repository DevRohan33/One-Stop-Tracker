import React from "react";
import { Plus, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navibar";
import ParameterModal from "../components/AddParameter";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Filler
);

export default function IndexPage({ parameters, onAddParameter }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleAddParameter = (newParam) => {
    onAddParameter(newParam);
    setIsModalOpen(false);
  };

  // Function to get trend information
  const getTrendInfo = (records) => {
    if (!records || records.length < 2) return { trend: 'stable', change: 0 };
    
    const recent = records.slice(-3); // Last 3 records
    const older = records.slice(-6, -3); // Previous 3 records
    
    if (recent.length === 0 || older.length === 0) return { trend: 'stable', change: 0 };
    
    const recentAvg = recent.reduce((sum, r) => sum + r.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.value, 0) / older.length;
    
    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (changePercent > 5) return { trend: 'up', change: changePercent };
    if (changePercent < -5) return { trend: 'down', change: Math.abs(changePercent) };
    return { trend: 'stable', change: Math.abs(changePercent) };
  };

  // Function to generate chart data with real user data
  const generateChartData = (param) => {
    const hasRecords = param.records?.length > 0;
    
    if (hasRecords) {
      // Sort records by date if they have timestamps
      const sortedRecords = [...param.records].sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return new Date(a.timestamp) - new Date(b.timestamp);
        }
        return 0;
      });

      // Use last 10 records for the chart
      const recentRecords = sortedRecords.slice(-10);
      
      const labels = recentRecords.map((record, index) => {
        if (record.timestamp) {
          return new Date(record.timestamp).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
        }
        return `Entry ${index + 1}`;
      });
      
      const data = recentRecords.map(record => record.value);
      
      // Calculate gradient colors based on trend
      const trend = getTrendInfo(param.records);
      let borderColor, backgroundColor;
      
      if (trend.trend === 'up') {
        borderColor = "#10b981"; // Green
        backgroundColor = "rgba(16, 185, 129, 0.1)";
      } else if (trend.trend === 'down') {
        borderColor = "#ef4444"; // Red
        backgroundColor = "rgba(239, 68, 68, 0.1)";
      } else {
        borderColor = "#8b5cf6"; // Purple
        backgroundColor = "rgba(139, 92, 246, 0.1)";
      }
      
      return {
        labels,
        datasets: [
          {
            label: param.name,
            data,
            borderColor,
            backgroundColor,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: borderColor,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
          },
        ],
      };
    }
    
    return null;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#8b5cf6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // No Data Component
  const NoDataState = () => (
    <div className="relative h-28 md:h-40 w-full mt-2 mb-2 md:mb-4 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/40 rounded-lg border border-dashed border-gray-600"></div>
      <div className="relative z-10 text-center">
        <BarChart3 size={24} className="text-gray-500 mx-auto mb-1 md:mb-2 animate-pulse md:w-8 md:h-8" />
        <p className="text-gray-400 text-xs md:text-sm font-medium mb-1">No data yet</p>
        <p className="text-gray-500 text-xs hidden md:block">Start tracking to see progress</p>
      </div>
      {/* Decorative dots */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
        <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="p-4 md:p-10 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {/* Enhanced parameter cards */}
            {parameters.map((param) => {
              const hasData = param.records?.length > 0;
              const trend = hasData ? getTrendInfo(param.records) : null;
              const chartData = generateChartData(param);
              const latestValue = hasData ? param.records[param.records.length - 1]?.value : null;

              return (
                <Link
                  to={`/parameter-chart/${param.id}`}
                  state={{ parameter: param }}
                  key={param.id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 hover:border-purple-500 rounded-xl p-4 md:p-6 w-full h-64 md:h-80 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-900/5 to-blue-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Header section */}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                          {param.name}
                        </h3>
                        <p className="text-gray-400 text-xs md:text-sm">
                          {param.records?.length || 0} records
                        </p>
                      </div>
                      {hasData && latestValue && (
                        <div className="text-right">
                          <div className="text-lg md:text-2xl font-bold text-white">
                            {latestValue}
                          </div>
                          <div className="text-xs text-gray-400">
                            {param.unit || ""}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Trend indicator */}
                    {hasData && trend && (
                      <div className="flex items-center gap-2 mb-2">
                        {trend.trend === 'up' && (
                          <>
                            <TrendingUp size={14} className="text-green-400 md:hidden" />
                            <TrendingUp size={16} className="text-green-400 hidden md:block" />
                            <span className="text-green-400 text-xs md:text-sm font-medium">
                              +{trend.change.toFixed(1)}%
                            </span>
                          </>
                        )}
                        {trend.trend === 'down' && (
                          <>
                            <TrendingDown size={14} className="text-red-400 md:hidden" />
                            <TrendingDown size={16} className="text-red-400 hidden md:block" />
                            <span className="text-red-400 text-xs md:text-sm font-medium">
                              -{trend.change.toFixed(1)}%
                            </span>
                          </>
                        )}
                        {trend.trend === 'stable' && (
                          <>
                            <Minus size={14} className="text-gray-400 md:hidden" />
                            <Minus size={16} className="text-gray-400 hidden md:block" />
                            <span className="text-gray-400 text-xs md:text-sm font-medium">
                              Stable
                            </span>
                          </>
                        )}
                        <span className="text-xs text-gray-500 hidden md:inline">vs. previous period</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Chart section */}
                  {hasData && chartData ? (
                    <div className="relative h-28 md:h-40 w-full mt-2 mb-2 md:mb-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10 rounded-lg pointer-events-none"></div>
                      <Line 
                        data={chartData} 
                        options={chartOptions} 
                      />
                    </div>
                  ) : (
                    <NoDataState />
                  )}
                  
                  {/* Footer section */}
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-xs md:text-sm text-gray-400">
                      {hasData && param.records[param.records.length - 1]?.timestamp 
                        ? `Last: ${new Date(param.records[param.records.length - 1].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` 
                        : "No data"
                      }
                      
                    </span>
                    <div className="px-2 md:px-3 py-1 bg-purple-600/20 group-hover:bg-purple-600/40 text-purple-300 rounded-full text-xs font-medium transition-colors">
                      {hasData ? "View" : "Start"}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Enhanced Add Card */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer group border-2 border-dashed border-purple-500/50 hover:border-purple-400 rounded-xl p-6 md:p-10 w-full h-64 md:h-80 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 bg-gradient-to-br from-purple-900/10 to-transparent hover:from-purple-900/20"
            >
              <div className="bg-purple-600/20 group-hover:bg-purple-600 group-hover:text-white text-purple-400 rounded-full p-4 md:p-6 mb-2 md:mb-4 transition-all duration-300 transform group-hover:scale-110">
                <Plus size={24} className="md:w-8 md:h-8" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-purple-200 group-hover:text-white transition-colors mb-1 md:mb-2">
                Add Parameter
              </h2>
              <p className="text-xs md:text-sm text-gray-400 text-center group-hover:text-gray-300 transition-colors hidden md:block">
                Start tracking a new metric
              </p>
            </div>
          </div>
        </div>
      </div>

      <ParameterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddParameter}
      />
    </>
  );
}