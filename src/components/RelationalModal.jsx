import React from 'react';

export default function RelationModal({ nodes, sourceId, onSelect, onCancel }) {
  const otherNodes = nodes.filter((n) => n.id !== sourceId);

  return (
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        zIndex: 2000,
        width: 300,
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Seleccionar clase destino</h3>
      {otherNodes.length === 0 ? (
        <p>No hay otras clases disponibles.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {otherNodes.map((node) => (
            <li
              key={node.id}
              onClick={() => onSelect(node.id)}
              style={{
                padding: '8px',
                marginBottom: 6,
                borderRadius: 6,
                background: '#f5f5f5',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e0e0')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            >
              🔗 {node.data.className}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onCancel}
        style={{
          marginTop: 10,
          background: '#ccc',
          border: 'none',
          padding: '6px 10px',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        Cancelar
      </button>
    </div>
  );
}
