import React from "react";
import { FaGithub, FaInstagram, FaGlobe } from "react-icons/fa";
import Navbar from "../components/Navibar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#2c003e] via-[#3c0063] to-black p-6 sm:p-10">
        <div className="max-w-3xl mx-auto mt-12 bg-white/10 backdrop-blur-md text-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-purple-500">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-purple-300">
            About One Stop Tracker
          </h1>
          <p className="text-lg leading-relaxed text-gray-200">
            Welcome to <span className="text-purple-400 font-semibold">One Stop Tracker</span> — your all-in-one
            solution for monitoring parameters, managing tasks, and staying organized in a clean, efficient way.
          </p>
          <p className="mt-4 text-gray-300">
            This platform is built with <strong>React</strong>, <strong>Tailwind CSS</strong>, and modern UI libraries to ensure a seamless and responsive user experience.
          </p>

          <div className="mt-6 border-t border-purple-500 pt-4 text-sm text-gray-400">
            Developed by{" "}
            <a
              href="https://rohan-beryl.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-300 hover:underline"
            >
              Rohan
            </a>{" "}
            at <span className="font-semibold text-white">Design Intelligence</span>
          </div>

          {/* Social Icons */}
          <div className="mt-4 flex gap-6 text-xl text-white">
            <a
              href="https://github.com/designintelligence"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://designintelligence-zxn8.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
              title="Website"
            >
              <FaGlobe />
            </a>
            <a
              href="https://instagram.com/designintelligence"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
              title="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
