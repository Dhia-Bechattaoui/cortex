import { Handle, Position, NodeProps } from '@xyflow/react';

export function FactNode({ data }: NodeProps) {
  return (
    <div className="px-5 py-3 shadow-[0_0_20px_rgba(139,92,246,0.15)] rounded-xl bg-gray-800 border border-gray-700 min-w-[160px] transition-transform hover:scale-105 hover:border-purple-500/50">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500 border-2 border-gray-800" />
      <div className="flex flex-col items-center text-center">
        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1.5">
          {data.category as string || 'Fact'}
        </span>
        <span className="text-sm text-gray-100 font-medium leading-tight">
          {data.label as string}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500 border-2 border-gray-800" />
    </div>
  );
}
