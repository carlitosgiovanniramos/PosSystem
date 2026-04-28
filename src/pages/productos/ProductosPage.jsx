import { useEffect, useMemo, useState } from "react";
import {
  buscarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../services/productosService";

import ProductoFormModal from "./ProductoFormModal";
import ProductoDeleteModal from "./ProductoDeleteModal";

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [texto, setTexto] = useState("");
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditandoId, setProductoEditandoId] = useState(null);

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoEliminar, setProductoEliminar] = useState(null);

  const [errorModal, setErrorModal] = useState("");
  const [errorEliminar, setErrorEliminar] = useState("");

  const [formProducto, setFormProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
  });

  const tamanio = 5;

  const cargarProductos = async () => {
    try {
      const response = await buscarProductos(texto, pagina, tamanio);
      setProductos(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  const buscar = () => {
    if (pagina === 1) {
      cargarProductos();
    } else {
      setPagina(1);
    }
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setErrorModal("");
    setFormProducto({
      nombre: "",
      precio: "",
      stock: "",
    });
    setMostrarModal(true);
  };

  const guardarNuevoProducto = async (e) => {
    e.preventDefault();
    setErrorModal("");

    try {
      await crearProducto({
        nombre: formProducto.nombre,
        precio: Number(formProducto.precio),
        stock: Number(formProducto.stock),
      });

      cerrarModal();
      await cargarProductos();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "Error al crear producto.";

      setErrorModal(mensaje);
    }
  };

  const abrirModalEditar = (producto) => {
    setModoEdicion(true);
    setProductoEditandoId(producto.id);
    setErrorModal("");

    setFormProducto({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
    });

    setMostrarModal(true);
  };

  const guardarEdicionProducto = async (e) => {
    e.preventDefault();
    setErrorModal("");

    try {
      await actualizarProducto(productoEditandoId, {
        id: productoEditandoId,
        nombre: formProducto.nombre,
        precio: Number(formProducto.precio),
        stock: Number(formProducto.stock),
      });

      cerrarModal();
      await cargarProductos();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "Error al actualizar producto.";

      setErrorModal(mensaje);
    }
  };

  const abrirModalEliminar = (producto) => {
    setProductoEliminar(producto);
    setErrorEliminar("");
    setMostrarModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    setMostrarModalEliminar(false);
    setProductoEliminar(null);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarProducto(productoEliminar.id);
      cerrarModalEliminar();
      await cargarProductos();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "No se pudo eliminar el producto.";

      setErrorEliminar(mensaje);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setModoEdicion(false);
    setProductoEditandoId(null);
    setErrorModal("");
  };

  const totalPaginas = Math.ceil(total / tamanio);

  const kpis = useMemo(() => {
    const valorInventario = productos.reduce(
      (acc, producto) =>
        acc + Number(producto.precio || 0) * Number(producto.stock || 0),
      0
    );

    const stockTotal = productos.reduce(
      (acc, producto) => acc + Number(producto.stock || 0),
      0
    );

    const bajoStock = productos.filter(
      (producto) => Number(producto.stock || 0) <= 5
    ).length;

    return {
      valorInventario,
      stockTotal,
      bajoStock,
    };
  }, [productos]);

  return (
    <div className="min-h-screen bg-[#f4f6f2] p-6 md:p-10 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-7 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#556B2F] mb-2">
                Módulo de inventario
              </p>

              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Productos
              </h1>

              <p className="text-slate-500 mt-1 text-sm">
                Gestión y control de productos, precios y stock
              </p>
            </div>

            <button
              onClick={abrirModalNuevo}
              className="bg-[#556B2F] hover:bg-[#445622] text-white rounded-2xl px-5 py-3 font-semibold shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              Nuevo producto
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total productos</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {total}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Stock visible</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {kpis.stockTotal}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#556B2F]/5 p-5">
              <p className="text-sm text-slate-500">Valor visible</p>
              <h3 className="text-2xl font-bold text-[#556B2F] mt-1">
                ${kpis.valorInventario.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") buscar();
              }}
              placeholder="Buscar producto por nombre..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10"
            />

            <button
              onClick={buscar}
              className="bg-[#556B2F] hover:bg-[#445622] text-white rounded-2xl px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              Buscar
            </button>
          </div>

          {kpis.bajoStock > 0 && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Hay {kpis.bajoStock} producto(s) visibles con stock bajo.
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Producto</th>
                <th className="p-4 text-left font-semibold">Precio</th>
                <th className="p-4 text-left font-semibold">Stock</th>
                <th className="p-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-100 hover:bg-[#556B2F]/5 transition-colors text-sm text-slate-700"
                >
                  <td className="p-4 font-semibold text-slate-500">
                    #{p.id}
                  </td>

                  <td className="p-4 font-medium text-slate-900">
                    {p.nombre}
                  </td>

                  <td className="p-4 font-semibold text-slate-800">
                    ${Number(p.precio || 0).toFixed(2)}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        Number(p.stock) <= 5
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {p.stock} unidades
                    </span>
                  </td>

                  <td className="p-4 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => abrirModalEditar(p)}
                      className="text-[#556B2F] hover:bg-[#556B2F]/10 px-3 py-1.5 rounded-xl transition-all duration-200 font-semibold"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => abrirModalEliminar(p)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all duration-200 font-semibold"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {productos.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 px-6 text-center text-slate-500 font-medium"
                  >
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            Total registros:{" "}
            <span className="font-semibold text-slate-900">{total}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <span className="px-4 py-2 font-medium text-slate-700 bg-slate-50 rounded-xl border border-slate-200">
              Página {pagina} de {totalPaginas || 1}
            </span>

            <button
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <ProductoFormModal
          titulo={modoEdicion ? "Editar producto" : "Nuevo producto"}
          formProducto={formProducto}
          setFormProducto={setFormProducto}
          onClose={cerrarModal}
          onSubmit={modoEdicion ? guardarEdicionProducto : guardarNuevoProducto}
          error={errorModal}
        />
      )}

      {mostrarModalEliminar && productoEliminar && (
        <ProductoDeleteModal
          producto={productoEliminar}
          onClose={cerrarModalEliminar}
          onConfirm={confirmarEliminar}
          error={errorEliminar}
        />
      )}
    </div>
  );
}

export default ProductosPage;