// src/components/ContextMenu.jsx
import React, { useEffect } from 'react';

export default function ContextMenu({ position, onAddNode, onClose }) {
    // Cierra el menú si haces clic fuera
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
            cursor: 'pointer',
            width: 180,
        }}
        onClick={(e) => e.stopPropagation()} // Evita cierre inmediato
        >
            <p style={{ margin: 0, fontWeight: 500, color: '#333' }}>Acciones</p>
            <hr style={{ margin: '6px 0' }} />
            <div
                onClick={onAddNode}
                style={{
                padding: '6px 4px',
                borderRadius: 6,
                background: '#f5f5f5',
                marginBottom: 4,
                transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e0e0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            >
                ➕ Crear nuevo nodo
            </div>
            <div
                onClick={onClose}
                style={{
                padding: '6px 4px',
                borderRadius: 6,
                background: '#f5f5f5',
                transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e0e0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            >
                ❌ Cancelar
            </div>
        </div>
    );
}
