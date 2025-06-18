import React from 'react';
import { Info } from 'lucide-react';

const AboutSection = () => {
  return (
    <section
      id="about"
      className="bg-white py-24 px-6 sm:px-12 md:px-24 border-t border-gray-200"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
          <Info className="w-7 h-7 text-blue-600" />
          About Our AMS
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-lg leading-relaxed mb-5">
          Our Student Attendance Management System (AMS) is designed to simplify and automate the attendance tracking process across educational institutions. Whether you manage a small class or an entire campus, AMS brings accuracy, efficiency, and transparency to your operations.
        </p>
        <p className="text-gray-500 text-base leading-relaxed">
          With features like real-time attendance logging, geo-tagged entries, smart analytics, and leave management, our platform empowers educators and administrators to focus on what truly matters — student success.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
