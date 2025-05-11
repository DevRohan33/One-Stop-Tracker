import React from "react";
import { useNavigate } from "react-router-dom";

function ParameterList({ parameters }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {parameters.map(param => (
        <div
          key={param.id}
          onClick={() => navigate(`/parameter-chart/${param.id}`)}
          className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:shadow-xl text-white"
        >
          <h3 className="text-xl font-bold">{param.name}</h3>
          <p className="text-purple-300">{param.unit}</p>
        </div>
      ))}
    </div>
  );
}

export default ParameterList;
