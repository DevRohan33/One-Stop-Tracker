import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/superbaseClient";
import { toast } from "react-hot-toast";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Login successful!");
      onLogin(); // ✅ trigger auth in App.jsx
      navigate("/dashboard");

    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-10 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="w-full max-w-[480px] bg-[rgba(121, 33, 141, 0.49)] p-12 pt-16 pb-10 rounded-2xl shadow-xl backdrop-blur-lg flex flex-col justify-center items-center">
        <h1 className="text-center text-4xl tracking-widest font-semibold mb-10 text-white">UniTrax</h1>

        <form onSubmit={handleLogin} className="space-y-3 w-full">
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-[#1e1e2f] text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-[#1e1e2f] text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-cyan-400 to-fuchsia-600 hover:from-cyan-300 hover:to-fuchsia-500 transition-all shadow-lg disabled:opacity-70"
          >
            {loading ? "Logging in..." : "LOG IN"}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-white">
          <a href="/forgot-password" className="text-purple-300 hover:text-purple-200 block">
            Forget Password?
          </a>

          <p className="mt-4 flex justify-center items-center gap-2">
            Don't&nbsp;have&nbsp;an&nbsp;account?
            <a
              href="/register"
              className="border border-pink-400 text-pink-400 px-3 py-1 rounded-md hover:bg-pink-400 hover:text-white transition-all"
            >
              Register
            </a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 justify-center items-center p-10 font-poppins">
        <div className="max-w-lg text-right">
          <h2 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            Track<span className="text-white"> , </span>Record &<br />
            <span className="text-white">Visualize </span>
            <span className="text-cyan-400 italic font-['Oooh_Baby'] text-6xl leading-snug tracking-wide">
              Your Life
            </span>
          </h2>
          <p className="text-gray-300 text-base mt-6 leading-relaxed tracking-wide">
            <span className="block mb-1">Your Life, Your Data – From sleep to self-care, </span>
            <span className="block">build custom trackers and watch your progress come to life.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
