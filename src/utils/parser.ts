import { Node, Edge } from '@xyflow/react';

export function parseConversation(transcriptStr: string) {
    const lines = transcriptStr.trim().split('\n');
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const timeline: any[] = [];

    const xCenter = 400; // Center spine for the conversation flow
    const xChildOffset = 450; // Distance to the right for child nodes

    let lastUserNodeId: string | null = null;
    let stepCount = 0;

    // Layout trackers
    let blockStartY = 50;
    let childY = 50;

    lines.forEach((line, i) => {
        if (!line) return;
        try {
            const data = JSON.parse(line);
            stepCount++;

            // Build Timeline Event ONLY for User Requests
            if (data.type === 'USER_INPUT') {
                let cleanContent = data.content ? data.content.replace(/<[^>]+>/g, '').trim() : "";
                let desc = cleanContent ? cleanContent.substring(0, 100) : "";

                timeline.push({
                    id: i.toString(),
                    time: data.created_at ? new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `Step ${data.step_index || stepCount}`,
                    action: "User Request",
                    description: desc + (desc.length >= 100 ? "..." : ""),
                    iconColor: "bg-green-500"
                });
            }

            // Build Visual Nodes
            const nodeId = `node-${i}`;
            let nodeType = 'fact';
            let contentStr = data.content || '';
            let labelStr = data.type || 'Event';
            let isUserRequest = false;

            if (data.type === 'USER_INPUT') {
                nodeType = 'user';
                labelStr = 'User Request';
                isUserRequest = true;
            } else if (data.source === 'MODEL' || data.type === 'PLANNER_RESPONSE') {
                nodeType = 'thought';
                labelStr = 'Agent Thought Process';
            } else if (data.source === 'SYSTEM' || data.type === 'TOOL_CALL') {
                nodeType = 'action';
                labelStr = `System: ${data.type}`;
                if (contentStr.startsWith('{') || contentStr.startsWith('[')) {
                    try { contentStr = JSON.stringify(JSON.parse(contentStr), null, 2); } catch (e) { }
                }
            } else if (data.type === 'EPHEMERAL_MESSAGE') {
                nodeType = 'action';
                labelStr = 'Ephemeral Constraint';
            }

            if (isUserRequest) {
                // Determine start Y for this new block. 
                // It must be below the lowest child of the PREVIOUS user block.
                blockStartY = Math.max(blockStartY + 200, childY + 150);
                if (i === 0) blockStartY = 50; // Reset for first node

                // Reset childY to start slightly below the new user node
                childY = blockStartY + 80;

                nodes.push({
                    id: nodeId,
                    type: nodeType,
                    position: { x: xCenter, y: blockStartY },
                    data: { label: labelStr, content: contentStr }
                });

                // Connect user spine
                if (lastUserNodeId) {
                    edges.push({
                        id: `e-${lastUserNodeId}-${nodeId}`,
                        source: lastUserNodeId,
                        target: nodeId,
                        animated: false, // User spine is solid
                        style: { stroke: '#22c55e', strokeWidth: 3 }
                    });
                }

                lastUserNodeId = nodeId;
            } else {
                // This is a child node (Thought, Action, Ephemeral, etc.)
                // Position it to the right and increment childY
                nodes.push({
                    id: nodeId,
                    type: nodeType,
                    hidden: true, // Hidden by default for performance
                    position: { x: xCenter + xChildOffset, y: childY },
                    data: { label: labelStr, content: contentStr, parentUserNodeId: lastUserNodeId }
                });

                // Connect to parent User Node
                if (lastUserNodeId) {
                    edges.push({
                        id: `e-${lastUserNodeId}-${nodeId}`,
                        source: lastUserNodeId,
                        target: nodeId,
                        hidden: true, // Hidden by default
                        animated: true,
                        style: { stroke: nodeType === 'thought' ? '#a855f7' : '#3b82f6', strokeWidth: 2, opacity: 0.7 }
                    });
                }

                // Process any nested tool calls (branching from THIS specific child node)
                let currentNestedY = childY;
                if (data.tool_calls && Array.isArray(data.tool_calls)) {
                    data.tool_calls.forEach((tool: any, tIndex: number) => {
                        currentNestedY += 120;
                        const toolNodeId = `tool-${i}-${tIndex}`;
                        const toolArgs = typeof tool.arguments === 'string' ? tool.arguments : JSON.stringify(tool.arguments, null, 2);

                        nodes.push({
                            id: toolNodeId,
                            type: 'action',
                            hidden: true, // Hidden by default
                            position: { x: xCenter + xChildOffset + 450, y: currentNestedY },
                            data: {
                                label: `Tool Executed: ${tool.name}`,
                                content: toolArgs,
                                parentUserNodeId: lastUserNodeId // Also track parent user node
                            }
                        });

                        edges.push({
                            id: `e-${nodeId}-${toolNodeId}`,
                            source: nodeId,
                            target: toolNodeId,
                            hidden: true, // Hidden by default
                            animated: true,
                            style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }
                        });
                    });
                }

                // Update childY to account for this node AND any nested tool calls we just rendered
                childY = currentNestedY + 140;
            }

        } catch (e) {
            // Ignore parse errors for malformed lines
        }
    });

    return { nodes, edges, timeline };
}
