import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const GeneralLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 dark:bg-gray-950 text-white text-center p-4 transition-colors duration-300">
        &copy; {new Date().getFullYear()} LuminaHack
      </footer>
    </div>
  );
};

export default GeneralLayout;
