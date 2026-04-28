import { useEffect, useRef, useState } from "react";
import { buscarProductos } from "../../services/productosService";

export default function ProductoSearchModal({ onClose, onSelect }) {
  const [texto, setTexto] = useState("");
  const [productos, setProductos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);

  const tamanio = 5;
  const inputRef = useRef(null);

  const cargarProductos = async () => {
    try {
      const res = await buscarProductos(texto, pagina, tamanio);
      setProductos(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // Carga inicial
  useEffect(() => {
    const fetch = async () => {
      await cargarProductos();
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 🔥 Búsqueda en tiempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagina === 1) {
        cargarProductos();
      } else {
        setPagina(1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [texto]);

  const buscar = () => {
    setPagina(1);
    cargarProductos();
  };

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Enter") {
        buscar();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, buscar]);

  const totalPaginas = Math.ceil(total / tamanio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
        
        {/* HEADER */}
        <div className="border-b border-slate-100 px-7 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#556B2F]">
                Selección de producto
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Buscar producto
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Busca y selecciona un producto para la factura.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-800"
            >
              ×
            </button>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-7 py-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              ref={inputRef}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10"
            />

            <button
              onClick={buscar}
              className="rounded-2xl bg-[#556B2F] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#445622] active:scale-[0.98]"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white text-sm">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wide text-slate-500">
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Nombre</th>
                <th className="p-4 text-left font-semibold">Precio</th>
                <th className="p-4 text-left font-semibold">Stock</th>
                <th className="p-4 text-center font-semibold">Acción</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-100 text-slate-700 transition-colors hover:bg-[#556B2F]/5"
                >
                  <td className="p-4 font-semibold text-slate-500">
                    #{p.id}
                  </td>

                  <td className="p-4 font-medium text-slate-900">
                    {p.nombre}
                  </td>

                  <td className="p-4 font-semibold text-slate-800">
                    ${p.precio}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        Number(p.stock) <= 5
                          ? "border border-amber-200 bg-amber-50 text-amber-700"
                          : "border border-slate-200 bg-slate-100 text-slate-700"
                      }`}
                    >
                      {p.stock} unidades
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        onSelect(p);
                        onClose();
                      }}
                      className="rounded-xl border border-[#556B2F]/20 px-4 py-2 text-xs font-semibold text-[#556B2F] transition-all duration-200 hover:bg-[#556B2F]/10"
                    >
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))}

              {productos.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-sm font-medium text-slate-500"
                  >
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-7 py-5 text-sm sm:flex-row">
          <span className="text-slate-500">
            Total: <span className="font-semibold text-slate-900">{total}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700">
              Página {pagina} de {totalPaginas || 1}
            </span>

            <button
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}