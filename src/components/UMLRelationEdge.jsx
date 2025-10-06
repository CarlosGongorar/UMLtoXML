import React from 'react';
import { getBezierPath } from '@xyflow/react';

export default function UMLRelationEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style = {},
}) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Definir el ID del marcador según el tipo
    const markerId =
        data?.relationType === 'inheritance'
            ? `marker-inheritance-${id}`
            : `marker-association-${id}`;

    return (
        <>
            {/* === Definición de marcadores personalizados === */}
            <defs>
                {/* Triángulo vacío para herencia */}
                <marker
                    id={`marker-inheritance-${id}`}
                    markerWidth="12"
                    markerHeight="12"
                    refX="12"
                    refY="6"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path
                        d="M0,0 L12,6 L0,12 Z"
                        fill="white"
                        stroke="#333"
                        strokeWidth="1"
                    />
                </marker>
            </defs>

            {/* === Línea de conexión === */}
            <path
                id={id}
                d={edgePath}
                stroke={style.stroke || '#333'}
                strokeWidth={style.strokeWidth || 2}
                fill="none"
                markerEnd={`url(#${markerId})`}
            />

            {/* === Multiplicidades === */}
            {data?.sourceMultiplicity && (
                <text
                    x={sourceX + (targetX - sourceX) * 0.2}
                    y={sourceY + (targetY - sourceY) * 0.2 - 5}
                    fill="#000"
                    fontSize="12"
                    textAnchor="middle"
                >
                    {data.sourceMultiplicity}
                </text>
            )}
            {data?.targetMultiplicity && (
                <text
                    x={targetX - (targetX - sourceX) * 0.2}
                    y={targetY - (targetY - sourceY) * 0.2 - 5}
                    fill="#000"
                    fontSize="12"
                    textAnchor="middle"
                >
                    {data.targetMultiplicity}
                </text>
            )}
        </>
    );
}
