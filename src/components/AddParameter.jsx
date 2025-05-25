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
        bg-gradient-to-br from-[#2d0053] to-[#1a002f] text-white p-10 sm:p-12 rounded-3xl shadow-2xl 
        w-[100%] max-w-lg z-50 overflow-y-auto max-h-[90vh] backdrop-blur-md"
    >
  <h2 className="text-3xl font-bold text-center mb-10">
    <span className="text-fuchsia-500">Add </span>
    <span className="italic font-['Oooh_Baby'] text-[#C42BE3] text-4xl">New</span>
    <span className="text-fuchsia-500"> Parameter</span>
  </h2>

  <label className="block mb-2 text-white text-base font-semibold">Parameter Name</label>
  <input
    type="text"
    placeholder="Eg. : Sleep"
    value={parameterName}
    onChange={(e) => setParameterName(e.target.value)}
    className="w-full p-5 mb-6 rounded-xl bg-[#0b001a] placeholder-gray-400 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-base"
  />

  <label className="block mb-2 text-white text-base font-semibold">Unit</label>
  <input
    type="text"
    placeholder="Eg. : Hour ,"
    value={unit}
    onChange={(e) => setUnit(e.target.value)}
    className="w-full p-5 mb-10 rounded-xl bg-[#0b001a] placeholder-gray-400 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-base"
  />

  <div className="flex justify-center gap-10">
    <button
      onClick={handleSave}
      className="px-7 py-3 rounded-xl border border-fuchsia-600 text-white hover:bg-fuchsia-700 hover:text-white transition-all text-base font-semibold"
    >
      Save
    </button>
    <button
      onClick={handleCancel}
      className="px-7 py-3 rounded-xl border border-fuchsia-600 text-white hover:bg-fuchsia-700 hover:text-white transition-all text-base font-semibold"
    >
      Cancel
    </button>
  </div>
</div>


  );
}
