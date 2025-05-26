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
    if (parameterName.trim() === "") return;
    const newParam = {
      name: parameterName.trim(),
      unit: unit.trim(),
    };

    onSave(newParam);
    setParameterName("");
    setUnit("");
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-gradient-to-br from-[#2d0053] to-[#1a002f] text-white p-6 sm:p-8 rounded-2xl shadow-xl w-[90vw] max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          <span className="text-fuchsia-500">Add </span>
          <span className="italic font-['Oooh_Baby'] text-[#C42BE3] text-3xl sm:text-4xl">New</span>
          <span className="text-fuchsia-500"> Parameter</span>
        </h2>

        <label className="block mb-2 text-white text-sm sm:text-base font-semibold">Parameter Name</label>
        <input
          type="text"
          placeholder="Eg: Sleep"
          value={parameterName}
          onChange={(e) => setParameterName(e.target.value)}
          className="w-full p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg sm:rounded-xl bg-[#0b001a] placeholder-gray-400 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm sm:text-base"
        />

        <label className="block mb-2 text-white text-sm sm:text-base font-semibold">Unit</label>
        <input
          type="text"
          placeholder="Eg: Hours"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full p-3 sm:p-4 mb-6 sm:mb-8 rounded-lg sm:rounded-xl bg-[#0b001a] placeholder-gray-400 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm sm:text-base"
        />

        <div className="flex justify-center gap-4 sm:gap-6">
          <button
            onClick={handleSave}
            className="px-5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-fuchsia-600 text-white hover:bg-fuchsia-700 hover:text-white transition-all text-sm sm:text-base font-semibold"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-fuchsia-600 text-white hover:bg-fuchsia-700 hover:text-white transition-all text-sm sm:text-base font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}