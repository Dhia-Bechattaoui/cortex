import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { MemoryGraph } from "./components/MemoryGraph";
import { MemoryTimeline } from "./components/MemoryTimeline";
import { DetailPanel } from "./components/DetailPanel";
import { parseConversation } from "./utils/parser";

interface Conversation {
  id: string;
  transcript: string;
}

function App() {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    // Call the Rust backend to scan the hard drive for Gemini logs
    invoke<Conversation[]>("get_gemini_conversations")
      .then((res) => {
        setConversations(res);
        if (res.length > 0) {
          setSelectedConvId(res[0].id); // Auto-select the first conversation
        }
      })
      .catch((err) => console.error("Failed to load conversations:", err));
  }, []);

  useEffect(() => {
    // Parse the selected conversation into Graph Nodes and Timeline Events
    if (selectedConvId) {
      const conv = conversations.find(c => c.id === selectedConvId);
      if (conv) {
        const parsed = parseConversation(conv.transcript);
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
        setTimeline(parsed.timeline);
        setSelectedNodeData(null); // Reset detail panel on conversation switch
        setFocusNodeId(null);
      }
    }
  }, [selectedConvId, conversations]);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden relative">
      {/* Sidebar with Conversation Dropdown */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-10 shadow-2xl relative">
        <div className="p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-sm">
            Cortex
          </h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.2em] font-bold">Memory Visualizer</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3 px-1">Gemini History</h3>
           {conversations.length === 0 ? (
             <p className="text-sm text-gray-600 px-1">Scanning local disk...</p>
           ) : (
             conversations.map(conv => (
               <button 
                 key={conv.id}
                 onClick={() => setSelectedConvId(conv.id)}
                 className={`w-full text-left px-3 py-2.5 rounded-lg transition-all font-medium text-xs flex items-center gap-2 truncate ${selectedConvId === conv.id ? 'bg-gray-800 text-gray-200 border border-gray-700 shadow-sm' : 'hover:bg-gray-800/50 text-gray-400 border border-transparent'}`}
                 title={conv.id}
               >
                 <span className={`w-1.5 h-1.5 flex-shrink-0 rounded-full ${selectedConvId === conv.id ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></span>
                 {conv.id.substring(0, 20)}...
               </button>
             ))
           )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900">
           <button className="w-full text-center px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold tracking-wide rounded-lg transition-all border border-blue-500/30 text-sm shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
             Connect Vector DB
           </button>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 relative">
         <div className="absolute top-4 left-6 z-10 flex gap-3">
           <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             <input type="text" placeholder="Search memories..." className="bg-transparent border-none text-sm text-gray-200 focus:outline-none w-48 placeholder-gray-500" />
           </div>
           
           <button 
             onClick={() => setIsTimelineOpen(true)}
             className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-full px-4 py-2 shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm text-gray-200 font-medium"
           >
             <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             View Timeline
           </button>
         </div>
         
         {/* Only render graph when nodes are parsed */}
         {nodes.length > 0 && <MemoryGraph 
            nodesData={nodes} 
            edgesData={edges} 
            onNodeClick={(n) => setSelectedNodeData(n.data)} 
            focusNodeId={focusNodeId}
         />}
      </main>

      <MemoryTimeline 
        isOpen={isTimelineOpen} 
        onClose={() => setIsTimelineOpen(false)} 
        events={timeline} 
        onEventClick={(id) => {
          setFocusNodeId(id);
          setIsTimelineOpen(false); // Close timeline so user can see the node
        }}
      />
      <DetailPanel nodeData={selectedNodeData} onClose={() => setSelectedNodeData(null)} />
    </div>
  );
}

export default App;
