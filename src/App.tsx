import { useState } from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
        Cortex
      </h1>
      <p className="text-gray-400 text-lg mb-8 max-w-md text-center">
        The Visual Memory Manager for your local AI agents.
      </p>
      <div className="flex gap-4">
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
          Load Memory File
        </button>
        <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors border border-gray-700">
          Settings
        </button>
      </div>
    </div>
  );
}

export default App;
