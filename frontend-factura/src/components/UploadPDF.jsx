import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadPDF = () => {
    const [pdf, setPdf] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [idBusqueda, setIdBusqueda] = useState('');
    const [facturaBuscada, setFacturaBuscada] = useState(null);
    const [errorBusqueda, setErrorBusqueda] = useState('');

    const handleChange = (e) => {
        setPdf(e.target.files[0]);
        setMensaje('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!pdf) return setMensaje('Selecciona un archivo PDF');

        const formData = new FormData();
        formData.append('pdf', pdf);

        try {
            const res = await axios.post('http://localhost:3000/api/factura/upload', formData);
            const idFactura = res.data.factura._id;
            setMensaje(`Factura guardada correctamente. ID: ${idFactura}`);
            fetchDocumentos();
        } catch (err) {
            const msgError = err.response?.data?.msg || 'Error al subir el PDF';
            setMensaje(msgError);
        }
    };

    const fetchDocumentos = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/factura/listar');
            setDocumentos(res.data);
        } catch (err) {
            console.error('Error al obtener documentos', err);
        }
    };

    const buscarFacturaPorId = async () => {
        if (!idBusqueda) {
            setErrorBusqueda('Por favor ingresa un ID para buscar');
            setFacturaBuscada(null);
            return;
        }
        setErrorBusqueda('');
        try {
            const res = await axios.get(`http://localhost:3000/api/factura/${idBusqueda}`);
            setFacturaBuscada(res.data);
        } catch (err) {
            setFacturaBuscada(null);
            if (err.response && err.response.status === 404) {
                setErrorBusqueda('Factura no encontrada');
            } else if (err.response && err.response.status === 400) {
                setErrorBusqueda('ID inválido');
            } else {
                setErrorBusqueda('Error al buscar la factura');
            }
        }
    };

    useEffect(() => {
        fetchDocumentos();
    }, []);

    return (
        <div>
            <h2>Subir documento PDF</h2>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    name="pdf"
                    accept="application/pdf"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Subir</button>
            </form>

            {mensaje && <p>{mensaje}</p>}

            <h3>Buscar factura por ID</h3>
            <input
                type="text"
                placeholder="Ingresa el ID de la factura"
                value={idBusqueda}
                onChange={(e) => setIdBusqueda(e.target.value)}
            />
            <button onClick={buscarFacturaPorId}>Buscar</button>
            {errorBusqueda && <p style={{ color: 'red' }}>{errorBusqueda}</p>}

            {facturaBuscada && (
                <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                    <h4>Factura encontrada:</h4>
                    <p><strong>ID:</strong> {facturaBuscada._id}</p>
                    <p><strong>Cliente:</strong> {facturaBuscada.cliente}</p>
                    <p><strong>Fecha:</strong> {new Date(facturaBuscada.fecha).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ${facturaBuscada.total}</p>
                </div>
            )}

        </div>
    );
};

export default UploadPDF;
