import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/superbaseClient";

function ParameterList() {
  const navigate = useNavigate();
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }

        const { data, error } = await supabase
          .from('parameters')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setParameters(data || []);
      } catch (err) {
        console.error("Error fetching parameters:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParameters();
  }, []);

  if (loading) {
    return <div className="text-white p-4">Loading parameters...</div>;
  }

  if (error) {
    return <div className="text-red-400 p-4">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {parameters.length > 0 ? (
        parameters.map(param => (
          <div
            key={param.id}
            onClick={() => navigate(`/parameter-chart/${param.id}`)}
            className="bg-gradient-to-br from-purple-900 to-indigo-800 p-6 rounded-xl cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 transition-all text-white"
          >
            <h3 className="text-xl font-bold">{param.name}</h3>
            <p className="text-purple-300">{param.unit}</p>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center text-white py-10">
          <p className="text-xl">No parameters found. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}

export default ParameterList;