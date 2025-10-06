import React, { useState } from 'react';

export default function CreateClassModal({ onCancel, onCreate }) {
    const [className, setClassName] = useState('NuevaClase');
    const [attributes, setAttributes] = useState(['']);
    const [methods, setMethods] = useState(['']);

    const handleAddAttribute = () => setAttributes([...attributes, '']);
    const handleAddMethod = () => setMethods([...methods, '']);

    const handleChange = (list, setList, i, value) => {
        const updated = [...list];
        updated[i] = value;
        setList(updated);
    };

    const handleSubmit = () => {
        onCreate({
        className,
        attributes: attributes.filter((a) => a.trim() !== ''),
        methods: methods.filter((m) => m.trim() !== ''),
        });
    };

    return (
        <div
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            padding: 20,
            zIndex: 2000,
            width: 320,
        }}
        >
        <h3 style={{ marginBottom: 10 }}>Crear nueva clase</h3>

        <label>Nombre de la clase:</label>
        <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
        />

        <label>Atributos:</label>
        {attributes.map((a, i) => (
            <input
            key={i}
            type="text"
            value={a}
            onChange={(e) => handleChange(attributes, setAttributes, i, e.target.value)}
            placeholder="+ atributo: Tipo"
            style={{ width: '100%', marginBottom: 4 }}
            />
        ))}
        <button onClick={handleAddAttribute} style={{ marginBottom: 10 }}>
            + Añadir atributo
        </button>
        <br />
        <label>Métodos:</label>
        {methods.map((m, i) => (
            <input
            key={i}
            type="text"
            value={m}
            onChange={(e) => handleChange(methods, setMethods, i, e.target.value)}
            placeholder="+ metodo(): void"
            style={{ width: '100%', marginBottom: 4 }}
            />
        ))}
        <button onClick={handleAddMethod} style={{ marginBottom: 10 }}>
            + Añadir método
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={onCancel}>Cancelar</button>
            <button onClick={handleSubmit}>Crear</button>
        </div>
        </div>
    );
}
