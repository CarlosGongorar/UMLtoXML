import { useState, useCallback } from 'react';
import { ReactFlow, ReactFlowProvider, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, Background, Controls } from '@xyflow/react';
import ContextMenu from './ContextMenu.jsx';
import NodeContextMenu from './NodeContextMenu.jsx';
import CreateClassModal from './CreateClassModal.jsx';
import RelationModal from './RelationalModal.jsx';
import MultiplicityModal from './MultiplicityModal.jsx'
import UMLClassNode from './nodes/UMLClassNode.jsx';
import UMLRelationNode from './UMLRelationEdge.jsx'

const nodeTypes = { umlClass: UMLClassNode };
const edgeTypes = { umlRelation: UMLRelationNode };
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
    const [showMultiplicityModal, setShowMultiplicityModal] = useState(false);
    const [selectedEdgeId, setSelectedEdgeId] = useState(null);
    const [selectedEdgeEnd, setSelectedEdgeEnd] = useState(null);

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
        setEdges((eds) => addEdge({ ...params, type: 'umlRelation', style: { strokeWidth: 2, stroke: '#333' } },  eds)),
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

    const handleAddMultiplicity = (nodeId) => {
        // Buscar un edge conectado a este nodo
        const edge = edges.find(
            (e) => e.source === nodeId || e.target === nodeId
        );
        if (!edge) return alert('⚠️ Este nodo no tiene relaciones.');

        // Determinar si el nodo es el source o target del edge
        const end = edge.source === nodeId ? 'source' : 'target';
        setSelectedEdgeId(edge.id);
        setSelectedEdgeEnd(end);
        setShowMultiplicityModal(true);
    };

    const handleConfirmMultiplicity = (value) => {
        setEdges((eds) =>
            eds.map((edge) => {
            if (edge.id !== selectedEdgeId) return edge;

            const newData =
                selectedEdgeEnd === 'source'
                ? { ...edge.data, sourceMultiplicity: value }
                : { ...edge.data, targetMultiplicity: value };

            return { ...edge, data: newData };
            })
        );
    };

    const handleCreateRelation = useCallback(
        (targetId) => {
            if (!relationSource || !targetId) return;

            const sourceNode = nodes.find((n) => n.id === relationSource);
            const multiplicity = sourceNode?.data?.multiplicity || '';

            const newEdge = {
                id: `edge_${relationSource}_${targetId}`,
                source: relationSource,
                target: targetId,
                type: 'umlRelation',
                style: { strokeWidth: 2, stroke: '#333' },
                data: {
                    sourceMultiplicity: '',
                    targetMultiplicity: '',
                },
            };
            setEdges((eds) => addEdge(newEdge, eds));
            setShowRelationModal(false);
            setRelationSource(null);
        },
        [relationSource, nodes]
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
            edgeTypes={edgeTypes}
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
            onAddMultiplicity={handleAddMultiplicity}
            onClose={() => setNodeMenu(null)}
        />

        {showCreateModal && (
            <CreateClassModal
            onCancel={() => setShowCreateModal(false)}
            onCreate={handleCreateNode}
            />
        )}

        {showMultiplicityModal && (
            <MultiplicityModal
                onConfirm={handleConfirmMultiplicity}
                onClose={() => setShowMultiplicityModal(false)}
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
