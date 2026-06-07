interface DetailPanelProps {
  nodeData: any | null;
  onClose: () => void;
}

export function DetailPanel({ nodeData, onClose }: DetailPanelProps) {
  return (
    <div 
      className={`fixed top-0 right-0 h-full w-[450px] bg-gray-900/98 backdrop-blur-2xl border-l border-gray-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out z-[60] flex flex-col ${
        nodeData ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
        <div>
           <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
             <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             {nodeData?.label || "Node Inspector"}
           </h2>
           <p className="text-xs text-gray-500 mt-0.5">Full Content View</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-black/20">
        <pre className="text-[13px] text-gray-300 whitespace-pre-wrap font-mono leading-relaxed break-words">
          {nodeData?.content || "No details available."}
        </pre>
      </div>
    </div>
  );
}
