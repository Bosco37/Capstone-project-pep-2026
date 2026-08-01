import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto mt-10 px-4 min-h-[calc(100vh-160px)] flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="md:w-1/2 text-left">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6 leading-tight">
          Welcome to <br />LuminaHack
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
          The centralized, professional platform to manage, organize, and participate in hackathons. Bring your groundbreaking ideas to light.
        </p>
        <div className="flex gap-4">
          <a href="/hackathons" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105">
            Explore Hackathons
          </a>
          <a href="/signup" className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-8 rounded-full shadow-md transition-all border border-gray-200 dark:border-gray-700">
            Join Now
          </a>
        </div>
      </div>
      <div className="md:w-1/2 w-full mt-10 md:mt-0 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 dark:opacity-40 animate-pulse"></div>
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Team collaborating at a hackathon" 
          className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[400px] border border-white/10"
        />
      </div>
    </div>
  );
};

export default Home;
