import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarFacturaPdf = ({ cliente, productos, subtotal, iva, total }) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Factura", 14, 20);

  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-EC")}`, 14, 30);

  doc.text(`Cliente: ${cliente.nombre} ${cliente.apellido}`, 14, 40);
  doc.text(`Teléfono: ${cliente.telefono?.valor ?? cliente.telefono}`, 14, 48);
  doc.text(`Dirección: ${cliente.direccion}`, 14, 56);
  doc.text(`Correo: ${cliente.correo?.valor ?? cliente.correo}`, 14, 64);

  autoTable(doc, {
    startY: 75,
    head: [["Id", "Nombre", "Precio", "Cantidad", "Precio * Unidad"]],
    body: productos.map((p) => [
      p.productoId,
      p.nombre,
      `$${p.precio}`,
      p.cantidad,
      `$${(p.precio * p.cantidad).toFixed(2)}`,
    ]),
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY);
  doc.text(`IVA: $${iva.toFixed(2)}`, 140, finalY + 8);
  doc.text(`Total: $${total.toFixed(2)}`, 140, finalY + 16);

  doc.save("factura.pdf");
};