import { Handle, Position } from '@xyflow/react';

export function ThoughtNode({ data }: { data: any }) {
  const cleanContent = data.content ? data.content.replace(/<[^>]+>/g, '').trim() : "";
  const snippet = cleanContent ? cleanContent.substring(0, 50).replace(/\n/g, ' ') + (cleanContent.length > 50 ? "..." : "") : "";
  return (
    <div className="bg-gray-900 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-xl w-[280px] hover:border-purple-400 transition-colors cursor-pointer">
      <div className="bg-purple-500/10 px-4 py-2 border-b border-gray-800 rounded-t-xl flex items-center gap-2">
        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">{data.label || 'Agent Thought'}</span>
      </div>
      <div className="p-3 text-xs text-gray-400 italic truncate">
        {snippet}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-purple-500 border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-purple-500 border-none" />
    </div>
  );
}
