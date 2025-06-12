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
      .filter(Boolean); // elimina líneas vacías

    let numeroFactura = '';
    let fecha = '';
    let cliente = '';
    let productos = [];
    let total = 0;

    const inicioProductos = lineas.findIndex(linea => linea.toLowerCase().includes('producto'));

    for (const linea of lineas) {
      if (linea.toLowerCase().startsWith('factura n°')) {
        numeroFactura = linea.split(':')[1]?.trim() ?? '';
      } else if (linea.toLowerCase().startsWith('fecha')) {
        fecha = linea.split(':')[1]?.trim() ?? '';
      } else if (linea.toLowerCase().startsWith('cliente')) {
        cliente = linea.split(':')[1]?.trim() ?? '';
      } else if (linea.toLowerCase().startsWith('total:')) {
        const valor = linea.split(':')[1]?.trim();
        total = parseFloat(valor.replace(/[^\d.]/g, '')) || 0;
      }
    }

    if (inicioProductos !== -1) {
      for (let i = inicioProductos + 1; i < lineas.length; i++) {
        const linea = lineas[i];
        if (linea.toLowerCase().startsWith('total:')) break;

        const partes = linea.split(/\s{2,}/);
        if (partes.length >= 3) {
          const nombre = partes[0];
          const cantidad = parseInt(partes[1]);
          const precioUnitario = parseFloat(partes[2]);

          if (!isNaN(cantidad) && !isNaN(precioUnitario)) {
            productos.push({ nombre, cantidad, precioUnitario });
          }
        }
      }
    }

    return {
      numeroFactura,
      fecha,
      cliente,
      productos,
      total,
    };
  } catch (error) {
    console.error('Error al extraer datos de la factura:', error.message);
    throw new Error('No se pudo procesar el archivo PDF');
  }
}
