import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  descripcion: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precioUnitario: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const facturaSchema = new Schema({
  numeroFactura: { type: String, required: true }, // SIN unique:true
  fecha: { type: Date, required: true },
  cliente: { type: String, required: true },
  direccion: { type: String },
  telefono: { type: String },
  items: [itemSchema],
  subtotal: { type: Number, required: true },
  iva: { type: Number, required: true },
  total: { type: Number, required: true },
  formaPago: { type: String }
}, {
  timestamps: true // agrega createdAt y updatedAt automáticamente
});

export default model("Factura", facturaSchema);
