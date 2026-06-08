import { useCallback, useEffect } from 'react';
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
  Node,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FactNode } from './nodes/FactNode';
import { UserNode } from './nodes/UserNode';
import { ThoughtNode } from './nodes/ThoughtNode';
import { ActionNode } from './nodes/ActionNode';

const nodeTypes = {
  fact: FactNode,
  user: UserNode,
  thought: ThoughtNode,
  action: ActionNode,
};

interface MemoryGraphProps {
  nodesData: Node[];
  edgesData: Edge[];
  onNodeClick?: (node: Node) => void;
  onPaneClick?: () => void;
  focusNodeId?: string | null;
}

function MemoryGraphInner({ nodesData, edgesData, onNodeClick, onPaneClick, focusNodeId }: MemoryGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesData);
  const { setCenter } = useReactFlow();

  // Sync state when props change
  useEffect(() => {
    setNodes(nodesData);
    setEdges(edgesData);
  }, [nodesData, edgesData, setNodes, setEdges]);

  // Focus node logic
  useEffect(() => {
    if (focusNodeId) {
      const node = nodes.find(n => n.id === focusNodeId);
      if (node) {
        setCenter(node.position.x + 140, node.position.y + 50, { zoom: 1.2, duration: 800 });
      }
    }
  }, [focusNodeId, nodes, setCenter]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeClick) onNodeClick(node);

    if (node.type === 'user') {
      const childNodeIds = new Set(nodes.filter(n => n.data?.parentUserNodeId === node.id).map(n => n.id));
      if (childNodeIds.size === 0) return; // No children to toggle

      const isFirstChildHidden = nodes.find(n => childNodeIds.has(n.id))?.hidden;
      const targetHiddenState = !isFirstChildHidden;

      setNodes((nds) => nds.map(n => 
        childNodeIds.has(n.id) ? { ...n, hidden: targetHiddenState } : n
      ));
      
      setEdges((eds) => eds.map(e => 
        // Toggle edges that connect to any of the child nodes.
        // We explicitly avoid toggling the user-to-user spine edge since the next user node is not a child.
        (childNodeIds.has(e.target) || childNodeIds.has(e.source)) 
          ? { ...e, hidden: targetHiddenState } 
          : e
      ));
    }
  }, [onNodeClick, nodes, setNodes, setEdges]);

  return (
    <div className="absolute inset-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={onPaneClick}
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

export function MemoryGraph(props: MemoryGraphProps) {
  return (
    <ReactFlowProvider>
      <MemoryGraphInner {...props} />
    </ReactFlowProvider>
  );
}
