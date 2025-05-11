import React from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navibar";
import ParameterModal from "../components/AddParameter";

export default function IndexPage({ parameters, onAddParameter }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleAddParameter = (newParam) => {
    onAddParameter(newParam);
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-start justify-start p-10 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="flex gap-8 justify-start items-center flex-wrap">
          {/* parameter cards */}
          {parameters.map((param) => (
            <Link
              to={`/parameter-chart/${param.id}`}
              state={{ parameter: param }}
              key={param.id}
              className="bg-[#1f2937] border border-purple-700 rounded-xl p-6 w-72 h-72 flex flex-col justify-center items-center shadow-lg hover:border-white transition"
            >
              <h3 className="text-2xl font-bold mb-2">{param.name}</h3>
              <p className="text-gray-400">{param.records?.length || 0} records</p>
            </Link>
          ))}

          {/* Add Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer group border-2 border-dashed border-purple-500 hover:border-white rounded-xl p-10 w-72 h-72 flex flex-col items-center justify-center transition hover:shadow-2xl"
          >
            <div className="bg-purple-600 group-hover:bg-white group-hover:text-purple-600 text-white rounded-full p-4 mb-4 transition">
              <Plus size={32} />
            </div>
            <h2 className="text-xl font-semibold group-hover:text-white transition">
              Add New Parameter
            </h2>
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
