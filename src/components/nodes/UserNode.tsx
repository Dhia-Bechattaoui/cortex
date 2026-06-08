import { Handle, Position } from '@xyflow/react';

export function UserNode({ data }: { data: any }) {
  const cleanContent = data.content ? data.content.replace(/<[^>]+>/g, '').trim() : "";
  const snippet = cleanContent ? cleanContent.substring(0, 50).replace(/\n/g, ' ') + (cleanContent.length > 50 ? "..." : "") : "";
  return (
    <div className="bg-gray-900 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)] rounded-xl w-[280px] hover:border-green-400 transition-colors cursor-pointer">
      <div className="bg-green-500/10 px-4 py-2 border-b border-gray-800 rounded-t-xl flex items-center gap-2">
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span className="text-xs font-bold text-green-400 uppercase tracking-widest">{data.label || 'User Request'}</span>
      </div>
      <div className="p-3 text-xs text-gray-300 font-medium truncate">
        {snippet}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-green-500 border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-green-500 border-none" />
    </div>
  );
}
