import { useEffect, useState } from "react";
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

  // ------------------------------
  // CARGAR PRODUCTOS
  // ------------------------------
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
    const fetch = async () => {
      await cargarProductos();
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  const buscar = () => {
    if (pagina === 1) {
      cargarProductos();
    } else {
      setPagina(1);
    }
  };

  // ------------------------------
  // CREAR
  // ------------------------------
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

  // ------------------------------
  // EDITAR
  // ------------------------------
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

  // ------------------------------
  // ELIMINAR
  // ------------------------------
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

  // ------------------------------
  const cerrarModal = () => {
    setMostrarModal(false);
    setModoEdicion(false);
    setProductoEditandoId(null);
    setErrorModal("");
  };

  const totalPaginas = Math.ceil(total / tamanio);

  // ------------------------------
  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10 font-sans text-neutral-800">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#636B2F] tracking-tight">
              Productos...
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">
              Gestión y control de tu inventario
            </p>
          </div>

          <button
            onClick={abrirModalNuevo}
            className="bg-[#636B2F] hover:bg-[#4f5625] text-white px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 font-medium flex items-center gap-2"
          >
            Nuevo producto
          </button>
        </div>

        {/* BUSCAR */}
        <div className="flex gap-4 mb-8 bg-neutral-50 p-2 rounded-2xl border border-neutral-100">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full bg-transparent px-4 py-2 outline-none text-neutral-700 placeholder:text-neutral-400"
          />

          <button
            onClick={buscar}
            className="bg-[#636B2F] hover:bg-[#4f5625] text-white px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 font-medium flex items-center gap-2"
          >
            Buscar
          </button>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-100">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-[#636B2F]/10 text-[#636B2F] border-b border-[#636B2F]/20 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 text-left font-semibold rounded-tl-2xl w-20">
                  ID
                </th>
                <th className="p-4 text-left font-semibold">Nombre</th>
                <th className="p-4 text-left font-semibold w-32">Precio</th>
                <th className="p-4 text-left font-semibold w-32">Stock</th>
                <th className="p-4 text-center font-semibold rounded-tr-2xl w-48">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-neutral-50 hover:bg-[#636B2F]/5 transition-colors text-sm text-neutral-600"
                >
                  <td className="p-4 font-medium text-neutral-800">{p.id}</td>
                  <td className="p-4">{p.nombre}</td>
                  <td className="p-4">${p.precio}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => abrirModalEditar(p)}
                      className="text-[#636B2F] hover:text-[#4f5625] hover:bg-[#636B2F]/10 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => abrirModalEliminar(p)}
                      className="text-olive-700 hover:text-white hover:bg-olive-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
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
                    className="p-8 text-center text-neutral-400 font-medium"
                  >
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 text-sm text-neutral-500">
          <p>
            Total registros:{" "}
            <span className="font-semibold text-neutral-800">{total}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all font-medium"
            >
              Anterior
            </button>

            <span className="px-4 py-2 font-medium text-neutral-700 bg-neutral-50 rounded-xl border border-neutral-100">
              Página {pagina} de {totalPaginas || 1}
            </span>

            <button
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all font-medium"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* MODAL FORM */}
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

      {/* MODAL DELETE */}
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
