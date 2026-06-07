import { MemoryGraph } from "./components/MemoryGraph";

function App() {
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-10 shadow-2xl relative">
        <div className="p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-sm">
            Cortex
          </h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.2em] font-bold">Memory Visualizer</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <button className="w-full text-left px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors border border-gray-700 font-semibold text-sm shadow-sm flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Current Session
           </button>
           <button className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-gray-400 rounded-lg transition-colors font-medium text-sm flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-gray-600"></span>
             Long-Term Vector DB
           </button>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900">
           <button className="w-full text-center px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold tracking-wide rounded-lg transition-all border border-blue-500/30 text-sm shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
             Connect Database
           </button>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 relative">
         {/* Absolute overlay elements can go here (e.g. search bar) */}
         <div className="absolute top-4 left-6 z-10">
           <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             <input type="text" placeholder="Search memories..." className="bg-transparent border-none text-sm text-gray-200 focus:outline-none w-48 placeholder-gray-500" />
           </div>
         </div>
         
         <MemoryGraph />
      </main>
    </div>
  );
}

export default App;
