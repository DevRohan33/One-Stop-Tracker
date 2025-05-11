import React, { useState } from "react";

export default function ParameterModal({ isOpen, onClose, onSave }) {
  const [parameterName, setParameterName] = useState("");
  const [unit, setUnit] = useState("");

  if (!isOpen) return null;

  const handleCancel = () => {
    onClose();
    setParameterName("");
    setUnit("");
  };

  const handleSave = () => {
    if (parameterName.trim() ==="") return;
    const newParam = {
      name: parameterName.trim(),
      unit: unit.trim(),
    };

    onSave(newParam);
    setParameterName("");
    setUnit("");
  };

  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-[#0f172a] text-white p-6 sm:p-8 rounded-2xl border border-purple-600 shadow-2xl 
        w-[90%] max-w-md z-50 overflow-y-auto max-h-[90vh]"
    >
      <h2 className="text-3xl font-bold text-center mb-8">Add New Parameter</h2>

      <label className="block mb-3 font-semibold text-lg">Parameter Name</label>
      <input
        type="text"
        placeholder="e.g. Temperature"
        value={parameterName}
        onChange={(e) => setParameterName(e.target.value)}
        className="w-full p-4 mb-6 rounded-md bg-black border border-purple-700 placeholder-gray-400 text-white text-md"
      />

      <label className="block mb-3 font-semibold text-lg">Unit</label>
      <input
        type="text"
        placeholder="e.g. °C"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="w-full p-4 mb-8 rounded-md bg-black border border-purple-700 placeholder-gray-400 text-white text-md"
      />

      <div className="flex justify-center gap-6">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-md font-semibold"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-md font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
