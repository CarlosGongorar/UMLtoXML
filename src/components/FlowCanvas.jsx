import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, } from '@xyflow/react';
import ContextMenu from './ContextMenu.jsx';
import CreateClassModal from './CreateClassModal.jsx';
import UMLClassNode from './nodes/UMLClassNode.jsx';

const nodeTypes = { umlClass: UMLClassNode };

let id = 3;
const getId = () => `node_${id++}`;

export default function FlowCanvas() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [menuPosition, setMenuPosition] = useState(null);
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

    const handleContextMenu = useCallback((event) => {
        event.preventDefault();
        setMenuPosition({ x: event.clientX, y: event.clientY });
    }, []);

    // Abre el modal de creación
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

    // Crea el nodo con los datos del modal
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
            fitView
        />

        <ContextMenu
            position={menuPosition}
            onAddNode={handleAddNodeClick}
            onClose={() => setMenuPosition(null)}
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
