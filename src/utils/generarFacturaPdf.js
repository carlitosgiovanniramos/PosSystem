import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarFacturaPdf = ({
  cliente,
  productos,
  subtotal,
  iva,
  total,
}) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;

  const olive = [85, 107, 47];
  const dark = [15, 23, 42];
  const muted = [100, 116, 139];
  const light = [248, 250, 244];
  const border = [226, 232, 240];

  const fecha = new Date().toLocaleDateString("es-EC");

  // HEADER
  doc.setFillColor(...light);
  doc.rect(0, 0, pageWidth, 42, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...dark);
  doc.text("FACTURA", marginX, 22);

  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("Documento generado por el sistema de ventas", marginX, 29);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...olive);
  doc.text(`Fecha: ${fecha}`, pageWidth - marginX, 18, { align: "right" });

  doc.setDrawColor(...olive);
  doc.setLineWidth(0.8);
  doc.line(marginX, 38, pageWidth - marginX, 38);

  // CLIENTE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...dark);
  doc.text("Datos del cliente", marginX, 52);

  doc.setDrawColor(...border);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(marginX, 57, pageWidth - marginX * 2, 34, 3, 3, "S");

  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("Cliente", marginX + 5, 66);
  doc.text("Telefono", marginX + 5, 78);
  doc.text("Direccion", pageWidth / 2, 66);
  doc.text("Correo", pageWidth / 2, 78);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...dark);

  doc.text(`${cliente.nombre} ${cliente.apellido}`, marginX + 5, 71);
  doc.text(`${cliente.telefono?.valor ?? cliente.telefono ?? "-"}`, marginX + 5, 83);
  doc.text(`${cliente.direccion ?? "-"}`, pageWidth / 2, 71);
  doc.text(`${cliente.correo?.valor ?? cliente.correo ?? "-"}`, pageWidth / 2, 83);

  // TABLA
  autoTable(doc, {
    startY: 102,
    head: [["ID", "Producto", "Precio", "Cantidad", "Subtotal"]],
    body: productos.map((p) => [
      p.productoId,
      p.nombre,
      `$${Number(p.precio).toFixed(2)}`,
      p.cantidad,
      `$${(Number(p.precio) * Number(p.cantidad)).toFixed(2)}`,
    ]),
    theme: "plain",
    headStyles: {
      fillColor: olive,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: dark,
      lineColor: border,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [250, 251, 247],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 18 },
      1: { halign: "left" },
      2: { halign: "right", cellWidth: 28 },
      3: { halign: "center", cellWidth: 25 },
      4: { halign: "right", cellWidth: 32, fontStyle: "bold" },
    },
    margin: { left: marginX, right: marginX },
  });

  const finalY = doc.lastAutoTable.finalY + 12;
  const boxWidth = 70;
  const boxX = pageWidth - marginX - boxWidth;

  // TOTALES
  doc.setDrawColor(...border);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(boxX, finalY, boxWidth, 38, 3, 3, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...muted);

  doc.text("Subtotal", boxX + 6, finalY + 10);
  doc.text(`$${subtotal.toFixed(2)}`, boxX + boxWidth - 6, finalY + 10, {
    align: "right",
  });

  doc.text("IVA 15%", boxX + 6, finalY + 20);
  doc.text(`$${iva.toFixed(2)}`, boxX + boxWidth - 6, finalY + 20, {
    align: "right",
  });

  doc.setDrawColor(...border);
  doc.line(boxX + 6, finalY + 25, boxX + boxWidth - 6, finalY + 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...olive);
  doc.text("TOTAL", boxX + 6, finalY + 34);
  doc.text(`$${total.toFixed(2)}`, boxX + boxWidth - 6, finalY + 34, {
    align: "right",
  });

  // FOOTER
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(
    "Gracias por su compra. Este documento fue generado automáticamente.",
    pageWidth / 2,
    pageHeight - 12,
    { align: "center" },
  );

  doc.save("factura.pdf");
};