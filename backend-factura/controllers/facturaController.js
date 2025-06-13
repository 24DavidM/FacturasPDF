import { extraerDatosFactura } from "../services/extractorService.js";
import Factura from "../models/Factura.js";
import fs from 'fs/promises';

const procesarFactura = async (req, res) => {
  try {
    const filePath = req.file.path;
    const datosFactura = await extraerDatosFactura(filePath);

    if (!datosFactura || !datosFactura.productos || datosFactura.productos.length === 0) {
      await fs.unlink(filePath);
      return res.status(400).json({ msg: "Factura inválida o vacía." });
    }

    const nuevaFactura = new Factura(datosFactura);
    await nuevaFactura.save();
    await fs.unlink(filePath);

    return res.status(201).json({
      msg: "Factura guardada correctamente",
      factura: nuevaFactura // Aquí debe venir el _id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al procesar la factura." });
  }
};

const obtenerFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await Factura.findById(id);
    if (!factura) return res.status(404).json({ msg: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la factura' });
  }
};
const listarFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find();
    res.json(facturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al listar facturas' });
  }
};


export{
  procesarFactura,
  obtenerFactura,
  listarFacturas
} 
  
