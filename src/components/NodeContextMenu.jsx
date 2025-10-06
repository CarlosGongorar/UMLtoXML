import React, { useEffect } from 'react';

export default function NodeContextMenu({ position, onDelete, onAddRelation, onAddMultiplicity, onClose }) {
    useEffect(() => {
        const handleClickOutside = () => onClose();
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    if (!position) return null;

    return (
        <div
        style={{
            position: 'absolute',
            top: position.y,
            left: position.x,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '8px 12px',
            zIndex: 1000,
            width: 180,
        }}
        onClick={(e) => e.stopPropagation()}
        >
        <p style={{ margin: 0, fontWeight: 500, color: '#333' }}>Acciones del nodo</p>
        <hr style={{ margin: '6px 0' }} />
        <div
            onClick={() => onAddRelation(position.nodeId)}
            style={{
            padding: '6px 4px',
            borderRadius: 6,
            background: '#f5f5f5',
            marginBottom: 4,
            cursor: 'pointer',
            }}
        >
            🔗 Añadir relación
        </div>
        <div
            onClick={() => onAddMultiplicity(position.nodeId)}
            style={{
            padding: '6px 4px',
            borderRadius: 6,
            background: '#f5f5f5',
            marginBottom: 4,
            cursor: 'pointer',
            }}
        >
            🔢 Añadir multiplicidad
        </div>
        <div
            onClick={() => onDelete(position.nodeId)}
            style={{
            padding: '6px 4px',
            borderRadius: 6,
            background: '#f5f5f5',
            marginBottom: 4,
            cursor: 'pointer',
            }}
        >
            🗑️ Eliminar clase
        </div>
        <div
            onClick={onClose}
            style={{
            padding: '6px 4px',
            borderRadius: 6,
            background: '#f5f5f5',
            cursor: 'pointer',
            }}
        >
            ❌ Cancelar
        </div>
        </div>
    );
}
