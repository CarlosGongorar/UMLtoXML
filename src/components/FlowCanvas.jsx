import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, } from '@xyflow/react';
import ContextMenu from './ContextMenu.jsx';
import NodeContextMenu from './NodeContextMenu.jsx';
import CreateClassModal from './CreateClassModal.jsx';
import UMLClassNode from './nodes/UMLClassNode.jsx';

const nodeTypes = { umlClass: UMLClassNode };
let id = 3;
const getId = () => `node_${id++}`;

export default function FlowCanvas() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [menuPosition, setMenuPosition] = useState(null);
    const [nodeMenu, setNodeMenu] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
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
        (params) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    // Clic derecho en el canvas
    const handleContextMenu = useCallback((event) => {
        event.preventDefault();
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setNodeMenu(null);
    }, []);

    // Clic derecho sobre un nodo
    const handleNodeContextMenu = useCallback((event, node) => {
        event.preventDefault();
        event.stopPropagation();
        setNodeMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
        setMenuPosition(null);
    }, []);

    // Crear nuevo nodo
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

    const handleCreateNode = useCallback((data) => {
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
    }, [pendingPosition]);

    // Eliminar nodo
    const handleDeleteNode = useCallback((nodeId) => {
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
        setNodeMenu(null);
    }, []);

    // Simular añadir una relación
    const handleAddRelation = useCallback((nodeId) => {
        // Por ejemplo: crear una nueva clase y conectarla
        const sourceNode = nodes.find((n) => n.id === nodeId);
        if (!sourceNode) return;

        const newNode = {
        id: getId(),
        type: 'umlClass',
        position: {
            x: sourceNode.position.x + 200,
            y: sourceNode.position.y,
        },
        data: {
            className: 'NuevaRelacion',
            attributes: [],
            methods: [],
        },
        };
        const newEdge = { id: `e_${nodeId}_${newNode.id}`, source: nodeId, target: newNode.id };
        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat(newEdge));
        setNodeMenu(null);
    }, [nodes]);

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
            onNodeContextMenu={handleNodeContextMenu} // 👈 muy importante
            fitView
        />

        {/* Menú general */}
        <ContextMenu
            position={menuPosition}
            onAddNode={handleAddNodeClick}
            onClose={() => setMenuPosition(null)}
        />

        {/* Menú del nodo */}
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
        </div>
    );
}
