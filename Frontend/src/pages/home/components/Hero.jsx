import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="w-full bg-white flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 lg:px-16 xl:px-20 py-14 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-32 left-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-blue-100 rounded-full blur-3xl opacity-30 z-0" />

      {/* Left Content */}
      <div className="w-full md:w-1/2 z-10 mb-12 md:mb-0 text-center sm:ml-35 md:text-left">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
          Student Attendance Management System
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mb-6">
          Seamlessly Track <br className="hidden sm:inline-block" />
          Student Attendance
        </h1>
        <ul className="space-y-4 text-gray-800 text-base sm:text-lg mb-8 sm:mb-10">
          {[
            'Real-time Attendance Logging',
            'Live Class Headcount',
            'Attendance Percentage Reports',
            'Custom Leave Requests',
          ].map((item, idx) => (
            <li key={idx} className="flex items-start sm:items-center justify-center md:justify-start gap-3">
              <CheckCircle className="w-5 h-5 mt-1 text-green-600 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Register Button */}
        <div className="flex justify-center md:justify-start">
          <Link to="/Adminregister" className="w-full sm:w-auto">
            <button className="w-full cursor-pointer sm:w-56 h-12 text-lg bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg active:scale-95">
              Register
            </button>
          </Link>
        </div>
      </div>

      {/* Right Cards */}
      <div className="w-full md:w-1/2 sm:mr-35 flex items-center justify-center z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-md">
          {[
            { title: 'Attendance Summary', color: 'bg-blue-50' },
            { title: 'Class-wise Overview', color: 'bg-green-50' },
            { title: 'Monthly Report', color: 'bg-yellow-50' },
            { title: 'Leave Requests', color: 'bg-red-50' },
          ].map(({ title, color }, idx) => (
            <div
              key={idx}
              className={`h-24 sm:h-28 ${color} border border-gray-200 rounded-xl shadow-md flex items-center justify-center text-gray-700 text-base font-semibold hover:scale-105 transition-transform duration-300`}
            >
              {title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
