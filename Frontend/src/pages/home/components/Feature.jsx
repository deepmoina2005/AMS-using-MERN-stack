import React from 'react';
import { Clock, MapPin, BarChart3, UserCheck } from 'lucide-react';

const features = [
  {
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    title: 'Real-Time Tracking',
    description: 'Monitor attendance as it happens, with instant updates and insights.',
  },
  {
    icon: <MapPin className="w-6 h-6 text-green-600" />,
    title: 'Geo-Location Based',
    description: 'Capture attendance with location tagging to avoid proxy marking.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-yellow-600" />,
    title: 'Analytics Dashboard',
    description: 'View class-wise, student-wise, or monthly attendance trends.',
  },
  {
    icon: <UserCheck className="w-6 h-6 text-red-600" />,
    title: 'Leave Management',
    description: 'Let students or admins submit and approve leave requests easily.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-gray-50 py-20 px-6 sm:px-12 md:px-24">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Why Choose Our AMS?
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          We bring powerful, flexible, and secure tools to simplify attendance.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
