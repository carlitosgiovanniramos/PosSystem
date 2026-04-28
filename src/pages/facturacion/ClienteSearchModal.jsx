import { useEffect, useState } from "react";
import { buscarClientes } from "../../services/clientesService";

function ClienteSearchModal({ onClose, onSelect }) {
  const [clientes, setClientes] = useState([]);
  const [texto, setTexto] = useState("");
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const tamanio = 5;

  const cargarClientes = async () => {
    try {
      const response = await buscarClientes(texto, pagina, tamanio);
      setClientes(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error al buscar clientes:", error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await cargarClientes();
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagina === 1) {
        cargarClientes();
      } else {
        setPagina(1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [texto]);

  const buscar = () => {
    if (pagina === 1) {
      cargarClientes();
    } else {
      setPagina(1);
    }
  };

  const totalPaginas = Math.ceil(total / tamanio);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-[#556B2F]">Buscar cliente</h2>
            <p className="text-sm text-slate-500">Busca por ID o apellido.</p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#556B2F]"
          />

          <button
            onClick={buscar}
            className="bg-[#556B2F] text-white px-5 py-2 rounded-lg hover:bg-[#445622]"
          >
            Buscar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-700">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Apellido</th>
                <th className="p-3 text-left">Teléfono</th>
                <th className="p-3 text-left">Correo</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{cliente.id}</td>
                  <td className="p-3">{cliente.nombre}</td>
                  <td className="p-3">{cliente.apellido}</td>
                  <td className="p-3">
                    {cliente.telefono?.valor ?? cliente.telefono}
                  </td>
                  <td className="p-3">
                    {cliente.correo?.valor ?? cliente.correo}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onSelect(cliente)}
                      className="text-[#556B2F] hover:underline font-medium"
                    >
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))}

              {clientes.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-5 text-center text-slate-500">
                    No se encontraron clientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-5">
          <p className="text-slate-500">
            Total: <span className="font-semibold">{total}</span>
          </p>

          <div className="flex gap-2 items-center">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
              className="px-4 py-2 rounded-lg border disabled:opacity-40"
            >
              Anterior
            </button>

            <span className="px-4 py-2">
              Página {pagina} de {totalPaginas || 1}
            </span>

            <button
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="px-4 py-2 rounded-lg border disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClienteSearchModal;
