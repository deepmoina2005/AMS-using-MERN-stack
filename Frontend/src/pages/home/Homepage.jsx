import React from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import { Helmet } from 'react-helmet';
import FeaturesSection from './components/Feature';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import HowItWorksSection from './components/HowItWorksSection';

// Optional reusable section wrapper
const Section = ({ id, title, children }) => (
  <section id={id} className="max-w-6xl mx-auto my-20 px-4">
    <h2 className="text-3xl font-semibold mb-6 text-gray-800">{title}</h2>
    <div className="text-slate-600 text-lg">{children}</div>
  </section>
);

const Homepage = () => {
  return (
    <>
      {/* Meta Tags for SEO */}
      <Helmet>
        <title>Attendance Management System</title>
        <meta 
          name="description" 
          content="Track student or employee attendance with real-time logging, live stats, and seamless analytics." 
        />
      </Helmet>

      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Page Content */}
      <main className="pt-24 bg-white">
        <Hero />

        {/* Features Section */}
        <FeaturesSection />
        <AboutSection/>
        <HowItWorksSection/>
      </main>

      <footer>
        <Footer/>
      </footer>
    </>
  );
};

export default Homepage;