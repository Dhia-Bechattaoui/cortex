import React, { useState } from 'react';

interface DetailPanelProps {
  nodeData: any | null;
  onClose: () => void;
}

interface ParsedBlock {
  type: string;
  content: string;
}

// Dynamically extract all XML-like tags and leave only clean text behind
function parseAllTags(content: string) {
  const blocks: ParsedBlock[] = [];
  let remainingText = content;
  
  // Regex matches <TAG_NAME>content</TAG_NAME>
  const regex = /<([A-Za-z0-9_]+)[^>]*>([\s\S]*?)<\/\1>/g;
  const matches = [...content.matchAll(regex)];
  
  for (const m of matches) {
    blocks.push({ type: m[1], content: m[2].trim() });
    remainingText = remainingText.replace(m[0], '');
  }
  
  return { blocks, remainingText: remainingText.trim() };
}

/* --- UI BLOCKS --- */

function MessageBlock({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-500/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(34,197,94,0.1)] mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
         <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
      </div>
      <h3 className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 relative z-10">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        Primary Request
      </h3>
      <div className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap relative z-10 font-medium">{content}</div>
    </div>
  );
}

function UserBlock({ content }: { content: string }) {
  return (
    <div className="bg-gray-900/80 border border-green-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
      <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        Included User Request
      </h3>
      <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{content}</div>
    </div>
  );
}

function MetadataBlock({ content }: { content: string }) {
  // Parsing known metadata formats
  const timeMatch = content.match(/The current local time is:\s*(.+)/i);
  const localTime = timeMatch ? timeMatch[1].trim() : null;

  const activeDocMatch = content.match(/Active Document:\s*(.+)/i);
  const activeDoc = activeDocMatch ? activeDocMatch[1].trim() : null;

  const cursorMatch = content.match(/Cursor is on line:\s*(\d+)/i);
  const cursorLine = cursorMatch ? cursorMatch[1].trim() : null;

  // Extract open documents list
  const docsMatch = content.match(/Other open documents:\s*([\s\S]+)/i);
  const openDocsList = docsMatch ? docsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace('-', '').trim()) : [];

  if (!localTime && !activeDoc && openDocsList.length === 0) {
    // Fallback if the parser fails to find known patterns
    return (
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          Environment Metadata
        </h3>
        <pre className="text-[11px] text-gray-400 font-mono whitespace-pre-wrap">{content}</pre>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Environment State
      </h3>
      <div className="space-y-3">
        {localTime && (
          <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg border border-gray-700/50">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="text-xs text-gray-300 font-mono">{localTime}</span>
          </div>
        )}
        
        {(activeDoc || cursorLine) && (
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
            <div className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Active Document</div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <div className="flex-1">
                <div className="text-[11px] text-gray-200 font-mono break-all leading-relaxed">{activeDoc || "Unknown"}</div>
                {cursorLine && <div className="text-[10px] text-gray-400 mt-1">Cursor at line {cursorLine}</div>}
              </div>
            </div>
          </div>
        )}

        {openDocsList.length > 0 && (
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
            <div className="text-[9px] text-gray-500 uppercase font-bold mb-2 tracking-wider">Other Open Documents</div>
            <ul className="space-y-1.5">
              {openDocsList.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-400 font-mono break-all leading-relaxed">
                  <span className="text-gray-600 mt-0.5">-</span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function ThoughtBlock({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.05)] transition-all">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex justify-between items-center bg-purple-900/20 hover:bg-purple-900/30 transition-colors"
      >
        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          AI Thought Process
        </span>
        <svg className={`w-4 h-4 text-purple-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {expanded && (
        <div className="p-4 border-t border-purple-500/10">
          <div className="text-[11px] text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">{content}</div>
        </div>
      )}
    </div>
  );
}

function SettingsChangeBlock({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="bg-blue-900/10 border border-blue-500/30 rounded-xl p-4 shadow-sm">
      <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        Settings Updated
      </h3>
      <div className="text-[11px] text-gray-300 leading-relaxed font-mono">{content}</div>
    </div>
  );
}

function EphemeralBlock({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="bg-red-900/10 border border-red-500/30 rounded-xl p-4 shadow-sm">
      <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        System Ephemeral Notice
      </h3>
      <div className="text-[11px] text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">{content}</div>
    </div>
  );
}

function ContextBlock({ title, content }: { title: string, content: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl overflow-hidden shadow-sm transition-all">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-3 flex justify-between items-center bg-cyan-900/20 hover:bg-cyan-900/30 transition-colors">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          System Context: {title.replace(/_/g, ' ')}
        </span>
        <svg className={`w-3.5 h-3.5 text-cyan-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {expanded && (
        <div className="p-4 border-t border-cyan-500/10">
          <div className="text-[11px] text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">{content}</div>
        </div>
      )}
    </div>
  );
}

function GenericTagBlock({ tag, content }: { tag: string, content: string }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-sm">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
        {tag}
      </h3>
      <div className="text-[11px] text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">{content}</div>
    </div>
  );
}

function ToolActionBlock({ label, args }: { label: string, args: any }) {
  const toolName = label.replace("Tool Executed:", "").trim();
  
  const isFileScan = ['view_file', 'list_dir', 'read_file', 'grep_search'].includes(toolName);
  const isCodeEdit = ['write_to_file', 'replace_file_content', 'multi_replace_file_content'].includes(toolName);
  const isCommand = ['run_command'].includes(toolName);

  let icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
  let color = "blue";
  let title = `System Action: ${toolName}`;

  if (isFileScan) {
    icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>;
    color = "cyan";
    title = `Scanned Context: ${toolName}`;
  } else if (isCodeEdit) {
    icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>;
    color = "orange";
    title = `Code Modifications: ${toolName}`;
  } else if (isCommand) {
    icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
    color = "yellow";
    title = `Terminal Command`;
  }

  const colorClasses = {
    blue: "bg-blue-900/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.05)]",
    cyan: "bg-cyan-900/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.05)]",
    orange: "bg-orange-900/10 border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.05)]",
    yellow: "bg-yellow-900/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.05)]",
  }[color];

  return (
    <div className={`border rounded-xl p-4 transition-all ${colorClasses}`}>
      <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2`}>
        {icon}
        {title}
      </h3>
      
      {/* File Scans UI */}
      {isFileScan && args.AbsolutePath && (
        <div className="bg-gray-900 border border-gray-800 rounded-md p-2.5 font-mono text-xs text-gray-300 break-all flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          {args.AbsolutePath}
        </div>
      )}
      
      {isFileScan && args.DirectoryPath && (
        <div className="bg-gray-900 border border-gray-800 rounded-md p-2.5 font-mono text-xs text-gray-300 break-all flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
          {args.DirectoryPath}
        </div>
      )}

      {/* Terminal Command UI */}
      {isCommand && args.CommandLine && (
        <div className="bg-black border border-gray-800 rounded-md p-3 font-mono text-xs text-green-400 break-all">
          <span className="text-gray-500 mr-2">$</span>{args.CommandLine}
        </div>
      )}

      {/* Code Edit UI */}
      {isCodeEdit && args.TargetFile && (
        <div className="mt-2">
          <div className="text-[10px] text-gray-400 mb-1 px-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Target File:
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-t-md p-2 font-mono text-xs text-gray-300 break-all border-b-0">
            {args.TargetFile}
          </div>
          {(args.CodeContent || args.ReplacementContent) && (
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-b-md p-3 overflow-x-auto relative">
               <pre className="font-mono text-[11px] text-blue-300 leading-relaxed">
                 {args.CodeContent || args.ReplacementContent}
               </pre>
            </div>
          )}
        </div>
      )}

      {/* Fallback for other tool args */}
      {!isFileScan && !isCodeEdit && !isCommand && (
        <div className="bg-gray-900/50 rounded-md p-3 overflow-x-auto mt-2">
          <pre className="font-mono text-[10px] text-gray-400">
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export function DetailPanel({ nodeData, onClose }: DetailPanelProps) {
  const content = nodeData?.content || "";
  const label = nodeData?.label || "Node Inspector";
  
  let parsedJson = null;
  if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
    try {
      parsedJson = JSON.parse(content);
    } catch(e){}
  }

  const { blocks, remainingText } = parseAllTags(content);
  const isToolCall = label.startsWith("Tool Executed:");
  
  // If no blocks, no json, no remaining text...
  const showRawFallback = blocks.length === 0 && !isToolCall && !remainingText;

  // Renderer function for parsed blocks
  const renderBlock = (block: ParsedBlock, idx: number) => {
    switch (block.type) {
      case 'USER_REQUEST':
        return <UserBlock key={idx} content={block.content} />;
      case 'ADDITIONAL_METADATA':
        return <MetadataBlock key={idx} content={block.content} />;
      case 'thought':
        return <ThoughtBlock key={idx} content={block.content} />;
      case 'USER_SETTINGS_CHANGE':
        return <SettingsChangeBlock key={idx} content={block.content} />;
      case 'EPHEMERAL_MESSAGE':
        return <EphemeralBlock key={idx} content={block.content} />;
      case 'user_rules':
      case 'user_information':
      case 'workflows':
      case 'artifacts':
      case 'slash_commands':
      case 'communication_style':
      case 'guidelines':
      case 'planning_mode':
      case 'planning_mode_artifacts':
        return <ContextBlock key={idx} title={block.type} content={block.content} />;
      default:
        // Generic fallback for any other tag
        return <GenericTagBlock key={idx} tag={block.type} content={block.content} />;
    }
  };

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-[500px] bg-gray-950/98 backdrop-blur-2xl border-l border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out z-[60] flex flex-col ${
        nodeData ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/80">
        <div>
           <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
             <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             {label}
           </h2>
           <p className="text-xs text-gray-500 mt-0.5 tracking-wide">Inspector</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20 custom-scrollbar">
        {/* Main Clean Text Content (if any) */}
        {remainingText && !parsedJson && <MessageBlock content={remainingText} />}

        {/* Dynamically Render Extracted Blocks */}
        {blocks.map((block, idx) => renderBlock(block, idx))}

        {/* Tool Action Rendering */}
        {isToolCall && parsedJson && <ToolActionBlock label={label} args={parsedJson} />}
        
        {/* Raw Fallback */}
        {showRawFallback && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Raw Content</h3>
            <pre className="text-[11px] text-gray-300 whitespace-pre-wrap font-mono leading-relaxed break-words">
              {content || "No details available."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
