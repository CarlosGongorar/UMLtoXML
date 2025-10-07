import { useState, useCallback } from 'react';
import { ReactFlow, ReactFlowProvider, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, Background, Controls } from '@xyflow/react';
import ContextMenu from './ContextMenu.jsx';
import NodeContextMenu from './NodeContextMenu.jsx';
import CreateClassModal from './CreateClassModal.jsx';
import RelationModal from './RelationalModal.jsx';
import MultiplicityModal from './MultiplicityModal.jsx';
import UMLClassNode from './nodes/UMLClassNode.jsx';
import UMLRelationNode from './UMLRelationEdge.jsx';

const nodeTypes = { umlClass: UMLClassNode };
const edgeTypes = { umlRelation: UMLRelationNode };
let id = 0;
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
        setEdges((eds) =>
            addEdge(
            { ...params, type: 'umlRelation', style: { strokeWidth: 2, stroke: '#333' } },
            eds
            )
        ),
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
        const edge = edges.find(
        (e) => e.source === nodeId || e.target === nodeId
        );
        if (!edge) return alert('⚠️ Este nodo no tiene relaciones.');
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
    (targetId, relationType) => {
        if (!relationSource || !targetId) return;

        const isInheritance = relationType === 'inheritance';

        const newEdge = {
            id: `edge_${relationSource}_${targetId}`,
            source: relationSource,
            target: targetId,
            type: 'umlRelation',
            data: {
                sourceMultiplicity: '',
                targetMultiplicity: '',
                relationType, // Guardamos el tipo en los datos
            },
            style: {
                strokeWidth: 2,
                stroke: '#333',
            },
            // Si es herencia, añadimos marcador triangular vacío
            markerEnd: isInheritance
                ? {
                    type: 'arrowclosed',
                    color: 'white',
                    width: 12,
                    height: 12,
                    strokeWidth: 1,
                }
                : {},
        };

        setEdges((eds) => addEdge(newEdge, eds));
        setShowRelationModal(false);
        setRelationSource(null);
    },
    [relationSource]
);

// 🔹 Exporta UML a XML (DTD) 
const handleExportUML = () => {
    const exportData = { nodes, edges };
    const nodesList = exportData.nodes || [];
    const edgesList = exportData.edges || [];

    // Clases UML
    const classNodes = nodesList.filter(
        (n) => n.type === "umlClass" || (n.data && n.data.className)
    );

    // Relaciones entre clases
    const relationsMap = new Map();

    edgesList.forEach((edge) => {
        const sourceNode = nodesList.find((n) => n.id === edge.source);
        const targetNode = nodesList.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) return;

        const sourceName = sourceNode.data?.className || edge.source;
        const targetName = targetNode.data?.className || edge.target;
        const targetMult = (edge.data?.targetMultiplicity || "").trim();

        let multiplicitySymbol = "";
        if (targetMult.includes("0..1")) multiplicitySymbol = "?";
        else if (targetMult.includes("1..*")) multiplicitySymbol = "+";
        else if (targetMult.includes("0..*")) multiplicitySymbol = "*";
        else multiplicitySymbol = ""; // 1..1 u otro caso

        if (!relationsMap.has(sourceName)) relationsMap.set(sourceName, []);
        relationsMap.get(sourceName).push(`${targetName}${multiplicitySymbol}`);
    });

    // --- Construcción del XML ---
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;

    classNodes.forEach((node) => {
        const className = node.data?.className || node.id;
        const attrs = node.data?.attributes || [];
        const attrNames = attrs.map((a) => a.split(":")[0].trim());
        const rels = relationsMap.get(className) || [];

        // 1️⃣ Línea principal con atributos + clases relacionadas
        const allChildren = [...attrNames, ...rels].join(", ");
        xml += `<!ELEMENT ${className} (${allChildren})>\n`;

        // 2️⃣ Definir cada atributo
        attrs.forEach((rawAttr) => {
            const attrName = rawAttr.split(":")[0].trim();
            xml += `<!ELEMENT ${attrName} (#CDATA)>\n`;
        });
    });

    // --- Descargar el archivo ---
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uml-dtd.xml";
    a.click();
    URL.revokeObjectURL(url);
};





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

        {/* 🔘 Botón de Exportar UML */}
        <button
            onClick={handleExportUML}
            style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            padding: '10px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
        >
            💾 Exportar UML
        </button>
        </div>
    );
}
