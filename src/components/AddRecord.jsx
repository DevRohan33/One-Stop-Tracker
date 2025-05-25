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
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-br from-[#2d0053] to-[#1a002f] text-white p-10 sm:p-12 rounded-3xl shadow-2xl 
          w-[100%] max-w-lg z-50 overflow-y-auto max-h-[90vh] backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-record-title"
      >
        <h2 id="add-record-title" className="text-3xl font-bold text-center mb-10">
          <span className="text-fuchsia-500">Add </span>
          <span className="italic font-['Oooh_Baby'] text-[#C42BE3] text-4xl">New</span>
          <span className="text-fuchsia-500"> Record</span>
        </h2>
        
        <label className="block mb-2 text-white text-base font-semibold">Value</label>
        <div className="flex items-center gap-3 mb-6">
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter value"
            className="flex-1 p-5 rounded-xl bg-[#0b001a] placeholder-gray-400 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-base"
          />
          <span className="text-base text-fuchsia-300 font-semibold">{unit || "mmol/cc"}</span>
        </div>
        
        <label className="block mb-2 text-white text-base font-semibold">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
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
        
          </>
        );
}
