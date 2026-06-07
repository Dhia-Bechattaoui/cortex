import { Node, Edge } from '@xyflow/react';

export function parseConversation(transcriptStr: string) {
    const lines = transcriptStr.trim().split('\n');
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const timeline: any[] = [];
    
    let yOffset = 50;
    const xCenter = 400; // Center spine for the conversation flow

    let lastMainNodeId: string | null = null;
    let stepCount = 0;
    
    lines.forEach((line, i) => {
        if (!line) return;
        try {
            const data = JSON.parse(line);
            stepCount++;
            
            // Build Timeline Event
            let desc = data.content ? data.content.substring(0, 100) : "";
            if (!desc && data.tool_calls && data.tool_calls.length > 0) {
                desc = `Used tool: ${data.tool_calls[0].name}`;
            } else if (!desc) {
                desc = "System execution";
            }
            timeline.push({
                id: i.toString(),
                time: data.created_at ? new Date(data.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : `Step ${data.step_index || stepCount}`,
                action: data.type ? data.type.replace(/_/g, ' ') : "Event",
                description: desc + (desc.length >= 100 ? "..." : ""),
                iconColor: data.source === "USER_EXPLICIT" ? "bg-green-500" : (data.source === "MODEL" ? "bg-purple-500" : "bg-blue-500")
            });
            
            // Build Visual Nodes
            const nodeId = `node-${i}`;
            let nodeType = 'fact';
            let contentStr = data.content || '';
            let labelStr = data.type || 'Event';
            let xPos = xCenter;
            let isMainTimeline = false;
            
            if (data.type === 'USER_INPUT') {
                nodeType = 'user';
                labelStr = 'User Request';
                isMainTimeline = true;
            } else if (data.source === 'MODEL' || data.type === 'PLANNER_RESPONSE') {
                nodeType = 'thought';
                labelStr = 'Agent Thought Process';
                isMainTimeline = true;
            } else if (data.source === 'SYSTEM' || data.type === 'TOOL_CALL') {
                nodeType = 'action';
                labelStr = `System: ${data.type}`;
                xPos = xCenter + 450; // Offset actions to the right
                // If content is huge JSON, format it
                if (contentStr.startsWith('{') || contentStr.startsWith('[')) {
                    try { contentStr = JSON.stringify(JSON.parse(contentStr), null, 2); } catch(e){}
                }
            } else if (data.type === 'EPHEMERAL_MESSAGE') {
                nodeType = 'action';
                labelStr = 'Ephemeral Constraint';
                xPos = xCenter - 450; // Offset ephemeral to the left
            }

            // Create primary node
            nodes.push({
                id: nodeId,
                type: nodeType,
                position: { x: xPos, y: yOffset },
                data: {
                    label: labelStr,
                    content: contentStr
                }
            });
            
            // Link node
            if (lastMainNodeId) {
                edges.push({
                    id: `e-${lastMainNodeId}-${nodeId}`,
                    source: lastMainNodeId,
                    target: nodeId,
                    animated: true,
                    style: { stroke: nodeType === 'user' ? '#22c55e' : (nodeType === 'thought' ? '#a855f7' : '#3b82f6'), strokeWidth: 2 }
                });
            }
            
            // Increment Layout
            if (isMainTimeline) {
                lastMainNodeId = nodeId;
                yOffset += 180; // Fixed vertical spacing for minimal nodes
            } else {
                yOffset += 120;
            }
            
            // Process Tool Calls branching off this node
            if (data.tool_calls && Array.isArray(data.tool_calls)) {
                data.tool_calls.forEach((tool: any, tIndex: number) => {
                    const toolNodeId = `tool-${i}-${tIndex}`;
                    const toolArgs = typeof tool.arguments === 'string' ? tool.arguments : JSON.stringify(tool.arguments, null, 2);
                    
                    nodes.push({
                        id: toolNodeId,
                        type: 'action',
                        position: { x: xCenter + 450, y: yOffset },
                        data: {
                            label: `Tool Executed: ${tool.name}`,
                            content: toolArgs
                        }
                    });
                    
                    edges.push({
                        id: `e-${nodeId}-${toolNodeId}`,
                        source: nodeId,
                        target: toolNodeId,
                        animated: true,
                        style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }
                    });
                    
                    yOffset += 120;
                });
            }

        } catch (e) {
            // Ignore parse errors for malformed lines
        }
    });
    
    return { nodes, edges, timeline };
}
