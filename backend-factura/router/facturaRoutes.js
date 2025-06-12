import { Router } from 'express';
import upload from '../middleware/upload.js';
import { extraerDatosFactura } from '../services/extractorService.js'; // Ajusta la ruta según tu proyecto

const router = Router();

router.post('/factura/upload', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' });
    }

    const datosFactura = await extraerDatosFactura(file.path);

    res.json(datosFactura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error procesando archivo PDF' });
  }
});

export default router;
