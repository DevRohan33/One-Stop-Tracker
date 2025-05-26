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
      onLogin();
      navigate("/dashboard");

    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-10 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      
      <div className="w-full md:max-w-[480px] bg-[rgba(121, 33, 141, 0.49)] p-6 md:p-12 pt-10 md:pt-16 pb-8 md:pb-10 rounded-2xl shadow-xl backdrop-blur-lg">
        <h1 className="text-center text-3xl md:text-4xl tracking-widest font-semibold mb-8 md:mb-10 text-white">UniTrax</h1>

        <form onSubmit={handleLogin} className="space-y-3 w-full">
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 text-sm md:text-base rounded-lg bg-[#1e1e2f] text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
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
              className="w-full p-3 text-sm md:text-base rounded-lg bg-[#1e1e2f] text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 md:mt-8 w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-cyan-400 to-fuchsia-600 hover:from-cyan-300 hover:to-fuchsia-500 transition-all shadow-lg disabled:opacity-70"
          >
            {loading ? "Logging in..." : "LOG IN"}
          </button>
        </form>

        <div className="text-center mt-4 md:mt-5 text-xs md:text-sm text-white">
          <a href="/forgot-password" className="text-purple-300 hover:text-purple-200 block">
            Forget Password?
          </a>

          <p className="mt-3 md:mt-4 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2">
            <span>Don't have an account?</span>
            <a
              href="/register"
              className="border border-pink-400 text-pink-400 px-3 py-1 rounded-md hover:bg-pink-400 hover:text-white transition-all text-sm md:text-base"
            >
              Register
            </a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 justify-center items-center p-6 md:p-10 font-poppins">
        <div className="max-w-lg text-right">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 md:mb-6 tracking-tight">
            Track<span className="text-white"> , </span>Record &<br />
            <span className="text-white">Visualize </span>
            <span className="text-cyan-400 italic font-['Oooh_Baby'] text-5xl md:text-6xl leading-snug tracking-wide">
              Your Life
            </span>
          </h2>
          <p className="text-gray-300 text-sm md:text-base mt-4 md:mt-6 leading-relaxed tracking-wide">
            <span className="block mb-1">Your Life, Your Data – From sleep to self-care, </span>
            <span className="block">build custom trackers and watch your progress come to life.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;