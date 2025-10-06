// components/edges/UMLRelationEdge.jsx
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
    markerEnd,
    }) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Coordenadas para colocar los textos
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    return (
        <>
        <path
            id={id}
            d={edgePath}
            stroke={style.stroke || '#333'}
            strokeWidth={style.strokeWidth || 2}
            fill="none"
            markerEnd={markerEnd}
        />
        
        {/* Multiplicidad del source */}
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

        {/* Multiplicidad del target */}
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
