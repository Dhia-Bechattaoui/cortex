import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FactNode } from './nodes/FactNode';

const nodeTypes = {
  fact: FactNode,
};

const initialNodes = [
  { id: '1', type: 'fact', position: { x: 250, y: 100 }, data: { label: 'Alice', category: 'User Entity' } },
  { id: '2', type: 'fact', position: { x: 100, y: 250 }, data: { label: 'Likes Coffee', category: 'Preference' } },
  { id: '3', type: 'fact', position: { x: 400, y: 250 }, data: { label: 'Lives in New York', category: 'Location' } },
  { id: '4', type: 'fact', position: { x: 250, y: 400 }, data: { label: 'Software Engineer', category: 'Occupation' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
];

export function MemoryGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        className="bg-gray-950"
      >
        <Controls className="bg-gray-800 border-gray-700 fill-gray-300 rounded overflow-hidden" />
        <MiniMap 
          nodeStrokeColor="#4c1d95" 
          nodeColor="#1f2937" 
          maskColor="rgba(0, 0, 0, 0.4)" 
          className="bg-gray-900 border border-gray-800 rounded-lg"
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#374151" />
      </ReactFlow>
    </div>
  );
}
