import { extraerDatosFactura } from "../services/extractorService.js";
import Factura from "../models/Factura.js";
import fs from 'fs/promises';

const procesarFactura = async (req, res) => {
  try {
    const filePath = req.file.path;

    const datosFactura = await extraerDatosFactura(filePath);

    if (!datosFactura || !datosFactura.productos || datosFactura.productos.length === 0) {
      return res.status(400).json({ msg: "Factura inválida o vacía." });
    }

    const nuevaFactura = new Factura(datosFactura);
    await nuevaFactura.save();

    await fs.unlink(filePath);

    res.status(201).json({ msg: "Factura guardada correctamente", factura: nuevaFactura });

  } catch (error) {
    console.error("Error al procesar factura:", error);
    res.status(500).json({ msg: "Error al procesar la factura." });
  }
};

export default procesarFactura;
