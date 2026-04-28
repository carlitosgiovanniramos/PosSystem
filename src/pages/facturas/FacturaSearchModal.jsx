import { useCallback, useEffect, useRef, useState } from "react";
import { buscarFacturas } from "../../services/facturasService";

function FacturaSearchModal({ onClose, onSelect }) {
  const [numeroFactura, setNumeroFactura] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const tamanio = 5;
  const inputRef = useRef(null);

  const cargarFacturas = useCallback(async () => {
    const res = await buscarFacturas(
      numeroFactura || null,
      null,
      pagina,
      tamanio,
    );

    setFacturas(res.data.data || []);
    setTotal(res.data.total || 0);
  }, [numeroFactura, pagina]);

  useEffect(() => {
    cargarFacturas();
  }, [cargarFacturas]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const buscar = useCallback(() => {
    if (pagina === 1) cargarFacturas();
    else setPagina(1);
  }, [pagina, cargarFacturas]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Enter") buscar();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, buscar]);

  const totalPaginas = Math.ceil(total / tamanio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-3 py-4 sm:px-6">
      <div className="flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-2xl">
        <div className="shrink-0 border-b border-slate-200 bg-gradient-to-r from-white to-[#f7f8f3] px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Buscar factura
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Consulta facturas por número y selecciona una.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-light text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <input
              ref={inputRef}
              value={numeroFactura}
              onChange={(e) => setNumeroFactura(e.target.value)}
              placeholder="Ingrese el número de factura..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10"
            />

            <button
              onClick={buscar}
              className="rounded-2xl bg-[#556B2F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#465826] active:scale-[0.98]"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#fafbf7] text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4 text-left font-bold">Factura</th>
                    <th className="px-5 py-4 text-left font-bold">Fecha</th>
                    <th className="px-5 py-4 text-left font-bold">Cliente</th>
                    <th className="px-5 py-4 text-right font-bold">Total</th>
                    <th className="px-5 py-4 text-center font-bold">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {facturas.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b border-slate-100 transition hover:bg-[#f8faf4]"
                    >
                      <td className="px-5 py-4 font-extrabold text-[#556B2F]">
                        {f.numeroFactura}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {new Date(f.fecha).toLocaleDateString("es-EC")}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {f.nombre} {f.apellido}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right font-extrabold text-slate-900">
                        ${Number(f.total).toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => onSelect(f)}
                          className="rounded-xl border border-[#556B2F]/25 bg-white px-4 py-2 text-sm font-bold text-[#556B2F] transition hover:bg-[#556B2F]/10"
                        >
                          Seleccionar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {facturas.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-14 text-center text-sm font-medium text-slate-500"
                      >
                        No se encontraron facturas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-[#fafbf7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Total de resultados:{" "}
              <span className="font-extrabold text-slate-900">{total}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>

              <span className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
                Página {pagina} de {totalPaginas || 1}
              </span>

              <button
                disabled={pagina >= totalPaginas}
                onClick={() => setPagina(pagina + 1)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacturaSearchModal;