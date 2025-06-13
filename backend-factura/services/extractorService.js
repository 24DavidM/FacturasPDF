import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

export async function extraerDatosFactura(rutaArchivoPdf) {
  try {
    const dataBuffer = await fs.readFile(rutaArchivoPdf);
    const data = await pdfParse(dataBuffer);
    const texto = data.text;

    const lineas = texto
      .split('\n')
      .map(linea => linea.trim())
      .filter(Boolean);

    // Función para limpiar y convertir valores numéricos
    const cleanNumber = (valor) => {
      if (!valor) return 0;
      const limpio = valor.replace(/[^\d,.-]/g, '').replace(',', '.');
      const numero = parseFloat(limpio);
      return isNaN(numero) ? 0 : numero;
    };

    // Variables a llenar
    let numeroFactura = '';
    let fecha = '';
    let cliente = '';
    let direccion = '';
    let telefono = '';
    let items = [];
    let subtotal = 0;
    let iva = 0;
    let total = 0;
    let formaPago = '';

    let dentroDeItems = false;

    for (const linea of lineas) {
      const lower = linea.toLowerCase();

      if (lower.includes('factura n.º')) {
        const partes = linea.split(':');
        if (partes.length > 1) numeroFactura = partes[1].trim();
      } else if (lower.startsWith('fecha')) {
        fecha = linea.split(':')[1]?.trim() ?? '';
      } else if (lower.startsWith('cliente')) {
        cliente = linea.split(':')[1]?.trim() ?? '';
      } else if (lower.startsWith('dirección')) {
        direccion = linea.split(':')[1]?.trim() ?? '';
      } else if (lower.startsWith('teléfono')) {
        telefono = linea.split(':')[1]?.trim() ?? '';
      } else if (lower.startsWith('forma de pago')) {
        formaPago = linea.split(':')[1]?.trim() ?? '';
      } else if (lower.startsWith('subtotal')) {
        subtotal = cleanNumber(linea.split(':')[1] ?? '');
      } else if (lower.includes('iva')) {
        iva = cleanNumber(linea.split(':')[1] ?? '');
      } else if (lower.startsWith('total')) {
        total = cleanNumber(linea.split(':')[1] ?? '');
      }

      // Detectar inicio de ítems
      if (lower.includes('ítem') && lower.includes('descripción')) {
        dentroDeItems = true;
        continue;
      }

      if (dentroDeItems && /^\d+\s+/.test(linea)) {
        // División más tolerante entre columnas
        const partes = linea.trim().split(/\s+(?=\$|\d)/);

        if (partes.length >= 4) {
          const [descripcionBruta, cantidadStr, precioStr, subtotalStr] = partes;
          const descripcion = descripcionBruta.replace(/^\d+\s*/, '');
          const cantidad = cleanNumber(cantidadStr);
          const precioUnitario = cleanNumber(precioStr);
          const subtotalItem = cleanNumber(subtotalStr);

          if (!isNaN(cantidad) && !isNaN(precioUnitario) && !isNaN(subtotalItem)) {
            items.push({
              descripcion: descripcion.trim(),
              cantidad,
              precioUnitario,
              subtotal: subtotalItem
            });
          }
        }
      }
    }

    if (!numeroFactura) {
      throw new Error('No se pudo encontrar el número de factura');
    }

    return {
      numeroFactura,
      fecha: fecha ? new Date(fecha) : new Date(),
      cliente,
      direccion,
      telefono,
      items,
      subtotal,
      iva,
      total,
      formaPago
    };
  } catch (error) {
    console.error('❌ Error al extraer datos de la factura:', error.message);
    throw new Error('No se pudo procesar el archivo PDF');
  }
}
