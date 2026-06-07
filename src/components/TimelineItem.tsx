interface TimelineItemProps {
  time: string;
  action: string;
  description: string;
  iconColor: string;
  onClick?: () => void;
}

export function TimelineItem({ time, action, description, iconColor, onClick }: TimelineItemProps) {
  return (
    <div className="flex gap-4 relative cursor-pointer group" onClick={onClick}>
      {/* Timeline Line */}
      <div className="absolute top-2 bottom-[-24px] left-[11px] w-0.5 bg-gray-800 -z-10"></div>
      
      {/* Icon Node */}
      <div className={`mt-1.5 w-6 h-6 rounded-full border-[3px] border-gray-900 shadow-sm flex-shrink-0 ${iconColor} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
         <div className={`w-2 h-2 rounded-full ${iconColor.replace('bg-', 'bg-').replace('/20', '')}`}></div>
      </div>
      
      {/* Content Card */}
      <div className="flex-1 pb-6">
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{time}</div>
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-lg p-3 shadow-sm group-hover:border-indigo-500/50 group-hover:bg-gray-800 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all">
          <span className="text-sm font-semibold text-gray-200 block mb-0.5">{action}</span>
          <span className="text-sm text-gray-400 leading-snug block">{description}</span>
        </div>
      </div>
    </div>
  );
}
