import React, { useState } from 'react';

export default function MultiplicityModal({ onConfirm, onClose }) {
    const [value, setValue] = useState('');

    const handleConfirm = () => {
        if (value.trim()) onConfirm(value);
        onClose();
    };

    return (
        <div
        style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
        }}
        >
        <div
            style={{
            background: 'white',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            width: 280,
            }}
        >
            <h4 style={{ marginTop: 0 }}>Añadir multiplicidad</h4>
            <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ej: 1..*, 0..1, 1"
            style={{
                width: '100%',
                padding: '6px',
                marginBottom: '10px',
                borderRadius: 4,
                border: '1px solid #ccc',
            }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={onClose}>Cancelar</button>
            <button onClick={handleConfirm}>Guardar</button>
            </div>
        </div>
        </div>
    );
}
