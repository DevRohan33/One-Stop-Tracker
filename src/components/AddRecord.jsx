import React, { useState, useEffect } from "react";

export default function AddRecord({ isOpen, onClose, onSave, unit }) {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().substr(0, 10));

  useEffect(() => {
    if (isOpen) {
      setValue("");
      setDate(new Date().toISOString().substr(0, 10));
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!value) return alert("Please enter a value");
    onSave({
      value: parseFloat(value),
      date: new Date(date).toISOString()
    });
  };

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    const handleEsc = e => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Removed the backdrop */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-[#0f172a] text-white p-6 sm:p-8 rounded-2xl border border-purple-600 shadow-2xl 
          w-[90%] max-w-md z-50 overflow-y-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-record-title"
      >
        <h2 id="add-record-title" className="text-3xl font-bold text-center mb-8">
          Add Record
        </h2>

        <label className="block mb-3 font-semibold text-lg">Value</label>
        <div className="flex items-center gap-3 mb-6">
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter value"
            className="flex-1 p-4 rounded-md bg-black border border-purple-700 placeholder-gray-400 text-white text-md"
          />
          <span className="text-lg text-purple-300 font-semibold">{unit || "mmol/cc"}</span>
        </div>

        <label className="block mb-3 font-semibold text-lg">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full p-4 mb-8 rounded-md bg-black border border-purple-700 text-white text-md"
        />

        <div className="flex justify-center gap-6">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-md font-semibold"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-md font-semibold"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
