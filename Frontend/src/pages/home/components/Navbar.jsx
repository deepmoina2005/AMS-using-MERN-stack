import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { School } from "lucide-react"; // ⬅️ Import your desired icon

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-[80px] z-50 bg-white border-b border-gray-200 px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between shadow-sm">
      {/* Logo with Icon and Text */}
      <Link
        to="/"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition font-bold text-lg"
      >
        <School size={24} />
        AMS
      </Link>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-3">
        <Link to="/choose">
          <button className="bg-blue-600 cursor-pointer text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all w-28 h-10 rounded-full shadow">
            Login
          </button>
        </Link>
        <Link to="/Adminregister">
          <button className="border cursor-pointer border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-600 hover:text-white active:scale-95 transition-all w-28 h-10 rounded-full">
            Register
          </button>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        aria-label="Toggle navigation"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
      >
        {isOpen ? (
          <X size={28} color="#1f2937" />
        ) : (
          <Menu size={28} color="#1f2937" />
        )}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border-b border-gray-200 p-6 md:hidden shadow-md z-40 rounded-b-xl">
          <div className="flex flex-col gap-3">
            <Link to="/choose">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 cursor-pointer text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all w-full h-10 rounded-full"
              >
                Login
              </button>
            </Link>
            <Link to="/Adminregister">
              <button
                onClick={() => setIsOpen(false)}
                className="border cursor-pointer border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-600 hover:text-white active:scale-95 transition-all w-full h-10 rounded-full"
              >
                Register
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
