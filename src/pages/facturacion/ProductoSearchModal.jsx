import { useEffect, useState } from "react";
import { buscarProductos } from "../../services/productosService";

export default function ProductoSearchModal({ onClose, onSelect }) {
  const [texto, setTexto] = useState("");
  const [productos, setProductos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);

  const tamanio = 5;

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

  const totalPaginas = Math.ceil(total / tamanio);

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-[800px] rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#636B2F]">
            Buscar producto
          </h2>
          <button onClick={onClose} className="text-gray-500 text-xl">×</button>
        </div>

        {/* BUSCADOR */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por nombre..."
            className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#636B2F]"
          />

          <button
            onClick={() => {
              setPagina(1);
              cargarProductos();
            }}
            className="bg-[#636B2F] text-white px-4 py-2 rounded-lg hover:bg-[#505822]"
          >
            Buscar
          </button>
        </div>

        {/* TABLA */}
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-b text-center">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">${p.precio}</td>
                <td className="p-2">{p.stock}</td>

                <td className="p-2">
                  <button
                    onClick={() => {
                      onSelect(p);
                      onClose();
                    }}
                    className="text-[#636B2F] font-medium hover:underline"
                  >
                    Seleccionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>Total: {total}</span>

          <div className="flex gap-2 items-center">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Anterior
            </button>

            <span>Página {pagina} de {totalPaginas}</span>

            <button
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}