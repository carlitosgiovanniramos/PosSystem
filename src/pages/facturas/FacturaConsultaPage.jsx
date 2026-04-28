import { useState } from "react";
import { obtenerFacturaPorId } from "../../services/facturasService";
import FacturaSearchModal from "./FacturaSearchModal";
import { generarFacturaPdf } from "../../utils/generarFacturaPdf";

function FacturaConsultaPage() {
  const [factura, setFactura] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarFactura = async (facturaSeleccionada) => {
    const res = await obtenerFacturaPorId(facturaSeleccionada.id);
    setFactura(res.data);
    setMostrarModal(false);
  };

  const detalles = factura?.detalles || [];

  const exportarPdf = () => {
    if (!factura) return;

    const cliente = {
      nombre: factura.nombre,
      apellido: factura.apellido,
      telefono: factura.telefono,
      direccion: factura.direccion,
      correo: factura.correo,
    };

    const productos = detalles.map((d) => ({
      productoId: d.productoId,
      nombre: d.nombre,
      precio: d.precioUnitario,
      cantidad: d.cantidad,
    }));

    generarFacturaPdf({
      cliente,
      productos,
      subtotal: factura.subtotal ?? 0,
      iva: factura.iva ?? 0,
      total: factura.total ?? 0,
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f5ef] px-4 py-6 md:px-8 text-slate-800">
      <div className="max-w-5xl mx-auto">

        {/* CONTENEDOR PRINCIPAL */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="px-6 md:px-8 py-7 border-b border-slate-200 bg-gradient-to-r from-white to-[#f7f8f3]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#556B2F]">
                  Módulo de ventas
                </p>

                <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
                  Factura
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Consulta y visualiza el detalle completo de una factura.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarModal(true)}
                  className="bg-[#556B2F] hover:bg-[#465826] text-white rounded-2xl px-5 py-2.5 text-sm font-bold transition"
                >
                  Buscar
                </button>

                <button
                  onClick={exportarPdf}
                  disabled={!factura}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Exportar PDF
                </button>
              </div>
            </div>
          </div>

          {/* INFO FACTURA */}
          <div className="px-6 md:px-8 py-6 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-xs uppercase text-slate-400 font-bold">
                Número de factura
              </p>
              <p className="text-xl font-extrabold text-[#556B2F] mt-1">
                {factura?.numeroFactura || "-"}
              </p>
            </div>

            <div className="md:text-right">
              <p className="text-xs uppercase text-slate-400 font-bold">
                Fecha
              </p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {factura
                  ? new Date(factura.fecha).toLocaleDateString("es-EC")
                  : "-"}
              </p>
            </div>
          </div>

          {/* CLIENTE */}
          <div className="px-6 md:px-8 py-6 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-400 uppercase mb-4">
              Datos del cliente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><span className="font-semibold">ID:</span> {factura?.clienteId || "-"}</p>
              <p><span className="font-semibold">Nombre:</span> {factura?.nombre || "-"}</p>
              <p><span className="font-semibold">Apellido:</span> {factura?.apellido || "-"}</p>
              <p><span className="font-semibold">Teléfono:</span> {factura?.telefono || "-"}</p>
              <p><span className="font-semibold">Dirección:</span> {factura?.direccion || "-"}</p>
              <p><span className="font-semibold">Correo:</span> {factura?.correo || "-"}</p>
            </div>
          </div>

          {/* TABLA */}
          <div className="px-6 md:px-8 py-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase mb-4">
              Detalle de productos
            </h2>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#fafbf7] text-xs uppercase text-slate-500">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-center">Precio</th>
                    <th className="px-4 py-3 text-center">Cantidad</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {detalles.map((d) => (
                    <tr key={d.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-slate-500">{d.productoId}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{d.nombre}</td>
                      <td className="px-4 py-3 text-center">${d.precioUnitario}</td>
                      <td className="px-4 py-3 text-center">{d.cantidad}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ${d.totalLinea}
                      </td>
                    </tr>
                  ))}

                  {detalles.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-slate-500">
                        Seleccione una factura para ver su detalle
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOTALES */}
          <div className="px-6 md:px-8 py-6 border-t border-slate-200 flex justify-end">
            <div className="w-full max-w-sm space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${factura?.subtotal?.toFixed?.(2) || "0.00"}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>IVA</span>
                <span>${factura?.iva?.toFixed?.(2) || "0.00"}</span>
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">
                  Total
                </span>
                <span className="text-2xl font-extrabold text-[#556B2F]">
                  ${factura?.total?.toFixed?.(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <FacturaSearchModal
          onClose={() => setMostrarModal(false)}
          onSelect={cargarFactura}
        />
      )}
    </div>
  );
}

export default FacturaConsultaPage;