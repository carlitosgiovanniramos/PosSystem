import { useState } from "react";
import { obtenerFacturaPorId } from "../../services/facturasService";
import FacturaSearchModal from "./FacturaSearchModal";

function FacturaConsultaPage() {
  const [factura, setFactura] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarFactura = async (facturaSeleccionada) => {
    const res = await obtenerFacturaPorId(facturaSeleccionada.id);
    setFactura(res.data);
    setMostrarModal(false);
  };

  const detalles = factura?.detalles || [];

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="bg-white rounded-2xl shadow p-7">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#556B2F]">
            Consulta de factura
          </h1>

          <button
            onClick={() => setMostrarModal(true)}
            className="bg-[#556B2F] text-white px-5 py-2 rounded-lg"
          >
            Buscar factura
          </button>
        </div>

        <div className="border rounded-xl overflow-hidden mb-6">
          <div className="grid grid-cols-2 bg-yellow-100 border-b">
            <div className="p-3 font-semibold">
              Número de factura:{" "}
              <span className="font-normal">{factura?.numeroFactura || ""}</span>
            </div>

            <div className="p-3 font-semibold text-right">
              Fecha:{" "}
              <span className="font-normal">
                {factura ? new Date(factura.fecha).toLocaleDateString("es-EC") : ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="border-r p-3 space-y-2">
              <p><b>Id:</b> {factura?.clienteId || ""}</p>
              <p><b>Nombre:</b> {factura?.nombre || ""}</p>
              <p><b>Apellido:</b> {factura?.apellido || ""}</p>
            </div>

            <div className="p-3 space-y-2">
              <p><b>Teléfono:</b> {factura?.telefono || ""}</p>
              <p><b>Dirección:</b> {factura?.direccion || ""}</p>
              <p><b>Correo:</b> {factura?.correo || ""}</p>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-3 text-left">Id</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-center">Precio</th>
              <th className="p-3 text-center">Cantidad</th>
              <th className="p-3 text-center">Precio * Unidad</th>
            </tr>
          </thead>

          <tbody>
            {detalles.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-3">{d.productoId}</td>
                <td className="p-3">{d.nombre}</td>
                <td className="p-3 text-center">${d.precioUnitario}</td>
                <td className="p-3 text-center">{d.cantidad}</td>
                <td className="p-3 text-center">${d.totalLinea}</td>
              </tr>
            ))}

            {detalles.length === 0 && (
              <tr>
                <td colSpan="5" className="p-5 text-center text-slate-500">
                  Busque una factura para visualizar su detalle
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="text-right mt-6 space-y-2">
          <p>Subtotal: ${factura?.subtotal?.toFixed?.(2) || "0.00"}</p>
          <p>IVA: ${factura?.iva?.toFixed?.(2) || "0.00"}</p>
          <p className="font-bold text-lg">
            Total: ${factura?.total?.toFixed?.(2) || "0.00"}
          </p>
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