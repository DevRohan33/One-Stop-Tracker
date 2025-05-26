import React, { useState, useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart
} from "recharts";
import AddRecord from "./AddRecord";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

function ParameterChart({ parameters, onAddRecord }) {
  const { paramId } = useParams();
  const navigate = useNavigate();
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const chartRef = useRef(null);

  const id = parseInt(paramId, 10);
  const parameter = parameters.find(p => p.id === id);
  const [chartType, setChartType] = useState("line");
  const [chartTime, setChartTime] = useState("all");

  if (!parameter) {
    return (
      <div className="text-white p-6">
        <p>Parameter not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-purple-600 px-4 py-2 rounded"
        >
          Back to List
        </button>
      </div>
    );
  }

  const getTimeFilteredData = () => {
    const now = new Date();
    let cutoff;

    switch (chartTime) {
      case "week":
        cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 7);
        break;
      case "month":
        cutoff = new Date(now);
        cutoff.setMonth(cutoff.getMonth() - 1);
        break;
      case "year":
        cutoff = new Date(now);
        cutoff.setFullYear(cutoff.getFullYear() - 1);
        break;
      default:
        cutoff = null;
    }

    const filteredRecords = parameter.records
      .filter(record => {
        const recordDate = new Date(record.date);
        return !cutoff || recordDate >= cutoff;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(record => ({
        date: new Date(record.date).toLocaleDateString(),
        value: parseFloat(record.value) || 0 
      }));

    return filteredRecords;
  };

  const formattedData = getTimeFilteredData();

  const handleAddRecordClick = () => {
    setIsRecordModalOpen(true);
  };

  const handelBack = () => {
    navigate("/");
  }

  const handleSaveRecord = recordData => {
    onAddRecord(id, {
      ...recordData,
      date: new Date(recordData.date).toISOString()
    });
    setIsRecordModalOpen(false);
  };

  const handleDownloadChart = async () => {
    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      canvas.toBlob((blob) => {
        saveAs(blob, `${parameter.name}-chart.png`);
      });
    } catch (error) {
      console.error("Error downloading chart:", error);
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium text-sm">{`Date: ${label}`}</p>
          <p className="text-purple-300 text-sm">
            <span className="font-medium">Value:</span> {payload[0].value} {parameter.unit || "mmol/cc"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-black min-h-screen">
      <div className="flex items-center justify-center min-h-screen w-full px-2 sm:px-4 md:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-black">
        <div className="max-w-6xl w-full">
          <div className="bg-gradient-to-br from-[#2d0053] to-[#1a002f] bg-opacity-40 rounded-xl shadow-lg p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <h2 className="text-white text-lg sm:text-2xl font-bold mb-2 sm:mb-0">
            {parameter.name} Chart
          </h2>
          <div className="text-white font-medium text-xs sm:text-base text-center sm:text-right">
            Unit: {parameter.unit || "mmol/cc"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full sm:w-44 bg-purple-800 text-white px-3 py-2 rounded-md shadow focus:outline-none text-sm sm:text-base"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
          <select
            value={chartTime}
            onChange={(e) => setChartTime(e.target.value)}
            className="w-full sm:w-44 bg-purple-800 text-white px-3 py-2 rounded-md shadow focus:outline-none text-sm sm:text-base"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>

          {/* Download Button
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadChart}
            className="w-full sm:w-44 bg-purple-800 text-white font-semibold px-4 py-2 rounded-md shadow text-sm sm:text-base"
          >
            Download Chart
          </motion.button> */}
        </div>

        <div
          ref={chartRef}
          className="relative h-64 sm:h-80 md:h-96 w-full max-w-6xl mx-auto bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden p-2 sm:p-4 md:p-6"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20"></div>
          </div>
          
          {/* Chart Content */}
          <AnimatePresence mode="wait">
            {formattedData && formattedData.length > 0 ? (
              <motion.div
                key={chartType}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.1, 0.25, 1],
                  staggerChildren: 0.1
                }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <AreaChart 
                      data={formattedData} 
                      margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                    >
                      {/* Simplified Grid for mobile */}
                      <CartesianGrid 
                        strokeDasharray="2 4" 
                        stroke="rgba(148, 163, 184, 0.2)"
                        strokeWidth={0.5}
                        horizontal={true} 
                        vertical={false}
                      />
                      
                      <XAxis 
                        dataKey="date" 
                        axisLine={{ 
                          stroke: "rgba(148, 163, 184, 0.3)", 
                          strokeWidth: 1 
                        }}
                        tickLine={{ 
                          stroke: "rgba(148, 163, 184, 0.2)", 
                          strokeWidth: 0.5 
                        }}
                        tick={{ 
                          fill: "rgba(226, 232, 240, 0.8)",
                          fontSize: 10,
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontWeight: 400
                        }}
                        tickMargin={8}
                        interval="preserveStartEnd"
                        minTickGap={5}
                      />
                      
                      <YAxis 
                        axisLine={{ 
                          stroke: "rgba(148, 163, 184, 0.3)", 
                          strokeWidth: 1 
                        }}
                        tickLine={{ 
                          stroke: "rgba(148, 163, 184, 0.2)", 
                          strokeWidth: 0.5 
                        }}
                        tick={{ 
                          fill: "rgba(226, 232, 240, 0.8)",
                          fontSize: 10,
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontWeight: 400
                        }}
                        tickMargin={8}
                      />
                      
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{
                          stroke: "rgba(168, 139, 250, 0.3)",
                          strokeWidth: 1,
                          strokeDasharray: "3 3"
                        }}
                      />
                      
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="50%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#c4b5fd" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
                          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.05)" />
                        </linearGradient>
                      </defs>
                      
                      {/* Area under the line */}
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="none"
                        fill="url(#areaGradient)"
                      />
                      
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="url(#lineGradient)"
                        strokeWidth={3}
                        dot={{ 
                          r: 4, 
                          strokeWidth: 2, 
                          fill: "#8b5cf6",
                          stroke: "#ffffff"
                        }}
                        activeDot={{ 
                          r: 6, 
                          fill: "#7c3aed",
                          stroke: "#ffffff",
                          strokeWidth: 2
                        }}
                        connectNulls={false}
                      />
                    </AreaChart>
                  ) : (
                    <BarChart 
                      data={formattedData} 
                      margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                    >
                      {/* Simplified Grid for mobile */}
                      <CartesianGrid 
                        strokeDasharray="2 4" 
                        stroke="rgba(148, 163, 184, 0.2)"
                        strokeWidth={0.5}
                        horizontal={true} 
                        vertical={false}
                      />
                      
                      <XAxis 
                        dataKey="date" 
                        axisLine={{ 
                          stroke: "rgba(148, 163, 184, 0.3)", 
                          strokeWidth: 1 
                        }}
                        tickLine={{ 
                          stroke: "rgba(148, 163, 184, 0.2)", 
                          strokeWidth: 0.5 
                        }}
                        tick={{ 
                          fill: "rgba(226, 232, 240, 0.8)",
                          fontSize: 10,
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontWeight: 400
                        }}
                        tickMargin={8}
                        interval="preserveStartEnd"
                        minTickGap={5}
                      />
                      
                      <YAxis 
                        axisLine={{ 
                          stroke: "rgba(148, 163, 184, 0.3)", 
                          strokeWidth: 1 
                        }}
                        tickLine={{ 
                          stroke: "rgba(148, 163, 184, 0.2)", 
                          strokeWidth: 0.5 
                        }}
                        tick={{ 
                          fill: "rgba(226, 232, 240, 0.8)",
                          fontSize: 10,
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontWeight: 400
                        }}
                        tickMargin={8}
                      />
                      
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{
                          fill: "rgba(168, 139, 250, 0.1)",
                          stroke: "rgba(168, 139, 250, 0.2)",
                          strokeWidth: 0.5
                        }}
                      />
                      
                      {/* Gradient Definition for Bars */}
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                      
                      <Bar 
                        dataKey="value" 
                        fill="url(#barGradient)"
                        radius={[4, 4, 0, 0]}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={0.5}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
                
                {/* Chart Type Indicator */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                    {chartType} Chart
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full flex flex-col items-center justify-center bg-transparent text-center"
              >
                {/* Empty State Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600/50">
                  <svg 
                    className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                    />
                  </svg>
                </div>
                
                {/* Empty State Text */}
                <h3 className="text-lg sm:text-xl font-semibold text-white/90 mb-1 sm:mb-2">
                  No Data Available
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xs leading-relaxed">
                  Add your first record to see beautiful visualizations and insights appear here.
                </p>
                
                {/* Decorative Elements */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 border border-dashed border-slate-600/30 rounded-full animate-pulse"></div>
                  <div className="absolute w-16 h-16 sm:w-24 sm:h-24 border border-dashed border-slate-600/20 rounded-full animate-pulse"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-br-full pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-full pointer-events-none"></div>
        </div>
        
        {/* Buttons */}
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:flex sm:gap-4">
          <button
            className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-800 hover:from-cyan-400 hover:to-fuchsia-700 text-white font-bold py-2 px-6 rounded-lg text-sm sm:text-base"
            onClick={handleAddRecordClick}
          >
            Add Record
          </button>
          <button
            className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-800 hover:from-cyan-400 hover:to-fuchsia-700 text-white font-bold py-2 px-4 rounded-md text-sm sm:text-base"
            onClick={handelBack}
          >
            Back
          </button>
        </div>
        
        {/* Modal */}
        {isRecordModalOpen && (
          <AddRecord
            isOpen={isRecordModalOpen}
            onClose={() => setIsRecordModalOpen(false)}
            onSave={handleSaveRecord}
            unit={parameter.unit}
          />
        )}
      </div>
    </div>
  </div>
  </div>
  );
}

export default ParameterChart;