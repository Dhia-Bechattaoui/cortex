import { Handle, Position } from '@xyflow/react';

export function ActionNode({ data }: { data: any }) {
  const snippet = data.content ? data.content.substring(0, 40).replace(/\n/g, ' ') + (data.content.length > 40 ? "..." : "") : "";
  return (
    <div className="bg-gray-900 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] rounded-xl w-[260px] hover:border-blue-400 transition-colors cursor-pointer">
      <div className="bg-blue-500/10 px-4 py-2 border-b border-gray-800 rounded-t-xl flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{data.label || 'Tool Call'}</span>
      </div>
      <div className="p-3 text-[10px] text-blue-300 font-mono bg-black/40 rounded-b-xl truncate">
        {snippet}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-500 border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500 border-none" />
    </div>
  );
}
