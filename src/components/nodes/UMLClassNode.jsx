// src/components/nodes/UMLClassNode.jsx
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function UMLClassNode({ data }) {
    const [className, setClassName] = useState(data.className || 'NuevaClase');
    const [attributes, setAttributes] = useState(data.attributes || ['+ atributo1: Tipo']);
    const [methods, setMethods] = useState(data.methods || ['+ metodo1(): void']);

    // Editar inline
    const handleChange = (list, setList, index, value) => {
        const updated = [...list];
        updated[index] = value;
        setList(updated);
    };

    return (
        <div
        style={{
            background: '#fff',
            border: '1px solid #333',
            borderRadius: 4,
            minWidth: 200,
            fontSize: 14,
            overflow: 'hidden',
            position: 'relative',
        }}
        >
        {/* Nombre de la clase */}
        <div
            style={{
            background: '#f5f5f5',
            borderBottom: '1px solid #333',
            padding: '6px',
            textAlign: 'center',
            fontWeight: 'bold',
            cursor: 'text',
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setClassName(e.target.innerText || 'Clase')}
        >
            {className}
        </div>

        {/* Atributos */}
        <div style={{ borderBottom: '1px solid #333', padding: '6px' }}>
            {attributes.map((attr, i) => (
            <div
                key={i}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleChange(attributes, setAttributes, i, e.target.innerText)}
                style={{ cursor: 'text' }}
            >
                {attr}
            </div>
            ))}
        </div>

        {/* Métodos */}
        <div style={{ padding: '6px' }}>
            {methods.map((m, i) => (
            <div
                key={i}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleChange(methods, setMethods, i, e.target.innerText)}
                style={{ cursor: 'text' }}
            >
                {m}
            </div>
            ))}
        </div>

        <Handle
            type="target"
            position={Position.Top}
            style={{ background: '#f5f5f5', borderColor: '#f5f5f5' }}
        />
        <Handle
            type="source"
            position={Position.Bottom}
            style={{ background: '#fff' }}
        />
        </div>
    );
}