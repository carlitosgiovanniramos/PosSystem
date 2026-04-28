import { useEffect, useState } from "react";
import { buscarFacturas } from "../../services/facturasService";

function FacturaSearchModal({ onClose, onSelect }) {
  const [numeroFactura, setNumeroFactura] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const tamanio = 5;

  const cargarFacturas = async () => {
    const res = await buscarFacturas(
      numeroFactura || null,
      null,
      pagina,
      tamanio,
    );

    setFacturas(res.data.data || []);
    setTotal(res.data.total || 0);
  };

  useEffect(() => {
    const fetch = async () => {
      await cargarFacturas();
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  const buscar = () => {
    if (pagina === 1) cargarFacturas();
    else setPagina(1);
  };

  const totalPaginas = Math.ceil(total / tamanio);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-[#556B2F]">Buscar factura</h2>
          <button onClick={onClose} className="text-xl">
            ×
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            value={numeroFactura}
            onChange={(e) => setNumeroFactura(e.target.value)}
            placeholder="Número de factura..."
            className="w-full border rounded-lg px-4 py-2"
          />

          <button
            onClick={buscar}
            className="bg-[#556B2F] text-white px-5 py-2 rounded-lg"
          >
            Buscar
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-3 text-left">Factura</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Acción</th>
            </tr>
          </thead>

          <tbody>
            {facturas.map((f) => (
              <tr key={f.id} className="border-b hover:bg-slate-50">
                <td className="p-3">{f.numeroFactura}</td>
                <td className="p-3">
                  {new Date(f.fecha).toLocaleDateString("es-EC")}
                </td>
                <td className="p-3">
                  {f.nombre} {f.apellido}
                </td>
                <td className="p-3 text-center">${f.total}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => onSelect(f)}
                    className="text-[#556B2F] hover:underline font-medium"
                  >
                    Seleccionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-5">
          <p>Total: {total}</p>
          <div className="flex gap-3">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
            >
              Anterior
            </button>
            <span>
              Página {pagina} de {totalPaginas || 1}
            </span>
            <button
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina(pagina + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacturaSearchModal;
