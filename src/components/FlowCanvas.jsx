import { useState, useCallback } from 'react';
import { ReactFlow, ReactFlowProvider, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, Background, Controls } from '@xyflow/react';
import ContextMenu from './ContextMenu.jsx';
import NodeContextMenu from './NodeContextMenu.jsx';
import CreateClassModal from './CreateClassModal.jsx';
import RelationModal from './RelationalModal.jsx';
import UMLClassNode from './nodes/UMLClassNode.jsx';

const nodeTypes = { umlClass: UMLClassNode };
let id = 3;
const getId = () => `node_${id++}`;

export default function FlowCanvasInner() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const [menuPosition, setMenuPosition] = useState(null);
    const [nodeMenu, setNodeMenu] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRelationModal, setShowRelationModal] = useState(false);
    const [relationSource, setRelationSource] = useState(null);
    const [pendingPosition, setPendingPosition] = useState(null);

    const reactFlowInstance = useReactFlow();

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    const onConnect = useCallback(
        (params) =>
        setEdges((eds) => addEdge({ ...params, type: 'smoothstep', style: { strokeWidth: 2, stroke: '#333' } },  eds)),
        []
    );

    const handleContextMenu = useCallback((event) => {
        event.preventDefault();
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setNodeMenu(null);
    }, []);

    const handleNodeContextMenu = useCallback((event, node) => {
        event.preventDefault();
        event.stopPropagation();
        setNodeMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
        setMenuPosition(null);
    }, []);

    const handleAddNodeClick = useCallback(() => {
        if (!menuPosition) return;
        const flowPos = reactFlowInstance.screenToFlowPosition({
        x: menuPosition.x,
        y: menuPosition.y,
        });
        setPendingPosition(flowPos);
        setShowCreateModal(true);
        setMenuPosition(null);
    }, [menuPosition, reactFlowInstance]);

    const handleCreateNode = useCallback(
        (data) => {
        if (!pendingPosition) return;
        const newNode = {
            id: getId(),
            type: 'umlClass',
            position: pendingPosition,
            data,
        };
        setNodes((nds) => nds.concat(newNode));
        setShowCreateModal(false);
        setPendingPosition(null);
        },
        [pendingPosition]
    );

    const handleDeleteNode = useCallback((nodeId) => {
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
        setNodeMenu(null);
    }, []);

    const handleAddRelation = useCallback((nodeId) => {
        setRelationSource(nodeId);
        setShowRelationModal(true);
        setNodeMenu(null);
    }, []);

    // ✅ Crear relación entre dos nodos y mostrar el edge
    const handleCreateRelation = useCallback(
        (targetId) => {
        if (!relationSource || !targetId) return;

        const newEdge = {
            source: relationSource,
            target: targetId,
            type: 'smoothstep',
            style: { strokeWidth: 2, stroke: '#333' }
        };

        setEdges((eds) => addEdge(newEdge, eds));
        setShowRelationModal(false);
        setRelationSource(null);
        },
        [relationSource]
    );

    return (
        <div
        style={{ width: '100vw', height: '100vh', position: 'relative' }}
        onContextMenu={handleContextMenu}
        >
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeContextMenu={handleNodeContextMenu}
            fitView
        >
            <Background />
            <Controls />
        </ReactFlow>

        <ContextMenu
            position={menuPosition}
            onAddNode={handleAddNodeClick}
            onClose={() => setMenuPosition(null)}
        />

        <NodeContextMenu
            position={nodeMenu}
            onDelete={handleDeleteNode}
            onAddRelation={handleAddRelation}
            onClose={() => setNodeMenu(null)}
        />

        {showCreateModal && (
            <CreateClassModal
            onCancel={() => setShowCreateModal(false)}
            onCreate={handleCreateNode}
            />
        )}

        {showRelationModal && (
            <RelationModal
            nodes={nodes}
            sourceId={relationSource}
            onSelect={handleCreateRelation}
            onCancel={() => setShowRelationModal(false)}
            />
        )}
        </div>
    );
}
