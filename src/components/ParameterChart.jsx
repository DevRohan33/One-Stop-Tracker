import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import AddRecord from "./AddRecord";
import { useParams, useNavigate } from "react-router-dom";

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
  const handelBack =()=>{
    navigate("/");
  }

  const handleSaveRecord = recordData => {
    onAddRecord(id, {
      ...recordData,
      date: new Date(recordData.date).toISOString()
    });
    setIsRecordModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-6 md:py-12 bg-gradient-to-br from-gray-900 via-purple-900 to-white text-black">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-80 rounded-xl shadow-lg backdrop-blur-md p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-black text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
            {parameter.name} Chart
          </h2>
          <div className="text-black font-medium text-sm sm:text-base text-center sm:text-right">
            Unit: {parameter.unit || "mmol/cc"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-44 bg-white text-black border border-gray-400 px-3 py-2 rounded shadow focus:outline-none"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
          <select
            value={chartTime}
            onChange={(e) => setChartTime(e.target.value)}
            className="w-44 bg-white text-black border border-gray-400 px-3 py-2 rounded shadow focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Chart */}
        <div className="h-72 sm:h-[28rem] w-full bg-white rounded-lg overflow-hidden">
          {formattedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={formattedData}>
                  <XAxis dataKey="date" stroke="#000" tick={{ fill: "#000" }} />
                  <YAxis stroke="#000" tick={{ fill: "#000" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #ef4444",
                      color: "#000"
                    }}
                    labelStyle={{ color: "#000" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2, fill: "#ef4444" }}
                    activeDot={{ r: 6, fill: "#000" }}
                  />
                </LineChart>
              ) : (
                <BarChart data={formattedData}>
                  <XAxis dataKey="date" stroke="#000" tick={{ fill: "#000" }} />
                  <YAxis stroke="#000" tick={{ fill: "#000" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #ef4444",
                      color: "#000"
                    }}
                    labelStyle={{ color: "#000" }}
                  />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-black text-lg rounded-xl">
              No records yet. Add a record to see data.
            </div>
          )}
        </div>
        
        {/* Buttons */}
        <div className="mt-6 space-y-2 sm:space-y-0 sm:flex sm:gap-4">
          <button
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddRecordClick}
          >
            Add Record
          </button>
          <button
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
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
