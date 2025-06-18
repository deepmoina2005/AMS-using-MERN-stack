import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-6 sm:px-12 md:px-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold mb-4">AMS</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your trusted partner in student and staff attendance tracking.
          </p>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>info@amsystem.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Guwahati, Assam, India</span>
            </li>
          </ul>
        </div>

        {/* Subscribe Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="border-t border-gray-700 mt-12 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
