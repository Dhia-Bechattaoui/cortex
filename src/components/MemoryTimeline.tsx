import { TimelineItem } from "./TimelineItem";

interface TimelineEvent {
  id: string;
  time: string;
  action: string;
  description: string;
  iconColor: string;
}

interface MemoryTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  events: TimelineEvent[];
  onEventClick?: (id: string) => void;
}

export function MemoryTimeline({ isOpen, onClose, events, onEventClick }: MemoryTimelineProps) {
  return (
    <div 
      className={`fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
        <div>
           <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
             <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             Memory Timeline
           </h2>
           <p className="text-xs text-gray-500 mt-0.5">{events.length} chronological events</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pt-6">
        <div className="relative">
          {events.length === 0 ? (
            <p className="text-sm text-gray-500 text-center mt-10">No events found in this conversation.</p>
          ) : (
            events.map((item) => (
              <TimelineItem 
                key={item.id}
                time={item.time}
                action={item.action}
                description={item.description}
                iconColor={item.iconColor}
                onClick={() => onEventClick && onEventClick(`node-${item.id}`)}
              />
            ))
          )}
          <div className="absolute bottom-0 left-[11px] w-0.5 h-12 bg-gradient-to-t from-gray-900 to-transparent -z-10"></div>
        </div>
      </div>
    </div>
  );
}
