import { Router } from 'express';
import upload from '../middleware/upload.js';
import { extraerDatosFactura } from '../services/extractorService.js';
import Factura from '../models/Factura.js';
import { obtenerFactura, listarFacturas } from '../controllers/facturaController.js';

const router = Router();

// Subir y procesar factura PDF
router.post('/factura/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ningún archivo' });

    // Extraer datos del PDF
    const datosFactura = await extraerDatosFactura(req.file.path);

    // Guardar en MongoDB
    const nuevaFactura = new Factura(datosFactura);
    await nuevaFactura.save();

    res.json({ mensaje: 'Factura guardada', factura: nuevaFactura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Error al procesar la factura' });
  }
});

// Listar todas las facturas
router.get('/factura/listar', listarFacturas);

// Obtener factura por ID
router.get('/factura/:id', obtenerFactura);

export default router;
