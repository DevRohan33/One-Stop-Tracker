import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
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

    return parameter.records
      .filter(record => {
        const recordDate = new Date(record.date);
        return !cutoff || recordDate >= cutoff;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(record => ({
        date: new Date(record.date).toLocaleDateString(),
        value: record.value
      }));
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
  // Download record data
  const handleDownloadChart = () => {
  const chartElement = document.getElementById("chart-container");
  if (chartElement) {
    html2canvas(chartElement).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, `${parameter.name}-chart.png`);
      });
    });
  }
};

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-gray-600">
            <span className="font-medium">Value:</span> {payload[0].value} {parameter.unit || "mmol/cc"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-6 md:py-12 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-black">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#2d0053] to-[#1a002f] bg-opacity-40 rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
            {parameter.name} Chart
          </h2>
          <div className="text-white font-medium text-sm sm:text-base text-center sm:text-right">
            Unit: {parameter.unit || "mmol/cc"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-44 bg-purple-800 text-white px-3 py-2 rounded-md shadow focus:outline-none"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
          <select
            value={chartTime}
            onChange={(e) => setChartTime(e.target.value)}
            className="w-44 bg-purple-800 text-white  px-3 py-2 rounded-md shadow focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        {/* Download Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadChart}
            className="w-44 bg-purple-800 text-white font-semibold px-4 py-2 rounded-md shadow"
          >
            Download Record
          </motion.button>
        </div>

        {/* Chart */}
      <div
        id="chart-container"
        className="h-76 sm:h-[28rem] w-full bg-transparent rounded-lg overflow-hidden p-4 pt-6"
      >
        <AnimatePresence mode="wait">
          {formattedData.length > 0 ? (
            <motion.div
              key={chartType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={formattedData} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid 
                  strokeDasharray="5 5" 
                  stroke="#e0e0e0"
                  strokeWidth={1.5}
                  horizontal={true} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  axisLine={{ stroke: "#e0e0e0", strokeWidth: 1.5 }}
                  tickLine={false}
                  tick={{ 
                    fill: "#e0e0e0",
                    fontSize: 12,
                    fontFamily: "inherit",
                    fontWeight: 400
                  }}
                />
                <YAxis 
                  axisLine={{ stroke: "#e0e0e0", strokeWidth: 1.5 }}
                  tickLine={false}
                  tick={{ 
                    fill: "#e0e0e0",
                    fontSize: 12,
                    fontFamily: "inherit",
                    fontWeight: 400
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#a78bfa"
                  strokeWidth={3}
                  dot={{ 
                    r: 5, 
                    strokeWidth: 2, 
                    fill: "#7c3aed",
                    stroke: "#ffffff"
                  }}
                  activeDot={{ 
                    r: 7, 
                    fill: "#7c3aed",
                    stroke: "#ffffff",
                    strokeWidth: 2
                  }}
                />
                  </LineChart>
                ) : (
                  <BarChart data={formattedData} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid 
                  strokeDasharray="5 5" 
                  stroke="#e0e0e0"
                  strokeWidth={1.5}
                  horizontal={true} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  axisLine={{ stroke: "#e0e0e0", strokeWidth: 1.5 }}
                  tickLine={false}
                  tick={{ 
                    fill: "#e0e0e0",
                    fontSize: 12,
                    fontFamily: "inherit",
                    fontWeight: 400
                  }}
                />
                <YAxis 
                  axisLine={{ stroke: "#e0e0e0", strokeWidth: 1.5 }}
                  tickLine={false}
                  tick={{ 
                    fill: "#e0e0e0",
                    fontSize: 12,
                    fontFamily: "inherit",
                    fontWeight: 400
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#a78bfa"
                  radius={[4, 4, 0, 0]}
                />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex items-center justify-center bg-transparent text-white text-lg rounded-xl"
            >
              No records yet. Add a record to see data.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
        
        
        {/* Buttons */}
        <div className="mt-6 space-y-2 sm:space-y-0 sm:flex sm:gap-4">
          <button
            className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-800 hover:from-cyan-400 hover:to-fuchsia-700 text-white text-white font-bold py-2 px-6 rounded-lg"
            onClick={handleAddRecordClick}
          >
            Add Record
          </button>
          <button
            className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-800 hover:from-cyan-400 hover:to-fuchsia-700 text-white font-bold py-2 px-4 rounded-md"
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
  );
}

export default ParameterChart;