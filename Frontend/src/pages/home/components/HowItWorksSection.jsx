import React from 'react';
import { ClipboardCheck, Clock, BarChart3, Users } from 'lucide-react';

const steps = [
  {
    icon: <ClipboardCheck className="w-6 h-6 text-blue-600" />,
    title: 'Easy Setup',
    desc: 'Register your institution and add students & staff with a few clicks.',
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    title: 'Live Attendance',
    desc: 'Record attendance in real-time using web or mobile devices.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    title: 'Track & Analyze',
    desc: 'Access dashboards, daily reports, and attendance summaries.',
  },
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: 'Engage Parents',
    desc: 'Send automated alerts and monthly attendance updates to parents.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-white py-20 px-6 sm:px-12 md:px-24">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 mx-auto bg-blue-100 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
