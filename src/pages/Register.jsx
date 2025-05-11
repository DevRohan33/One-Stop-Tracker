import React from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate()

    const handelLoginClick =() => {
        navigate('/login')
    }
    const handelRegister =() => {
        navigate('/')
    }

  return (
    <section
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-neutral-800">
        {/* Left Panel */}
        <div className="w-full lg:w-1/2 p-10 text-white">
          <div className="text-center mb-10">
            <img
              className="mx-auto w-24 mb-4"
              src="/logo.png"
              alt="logo"
            />
            <h2 className="text-2xl font-bold">Create an Account</h2>
          </div>

          <form>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-md px-4 py-2 bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md px-4 py-2 bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full rounded-md px-4 py-2 bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 py-2 text-white font-semibold uppercase shadow-md hover:shadow-lg transition"
              onClick={handelRegister}
            >
              Register
            </button>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm">Already have an account?</p>
              <button
                type="button"
                className="rounded border border-white px-4 py-1 text-xs uppercase text-white hover:bg-white hover:text-neutral-800 transition"
                onClick={handelLoginClick}
              >
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel */}
        <div
          className="hidden lg:flex lg:w-1/2 items-center justify-center text-white text-center p-10"
          style={{
            background: "linear-gradient(to right, #ff512f, #dd2476)",
          }}
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">Join One Stop Tracker</h3>
            <p className="text-sm">
              Get started with a smarter way to track your tasks, goals, and analytics in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
