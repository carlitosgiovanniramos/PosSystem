import { useEffect, useState } from "react";
import {
  guardarFactura,
  obtenerSiguienteNumeroFactura,
} from "../../services/facturasService";
import ClienteSearchModal from "./ClienteSearchModal";
import ProductoSearchModal from "./ProductoSearchModal";
import { generarFacturaPdf } from "../../utils/generarFacturaPdf";

function FacturacionPage() {
  const [cliente, setCliente] = useState(null);
  const [productos, setProductos] = useState([]);

  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);

  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadProducto, setCantidadProducto] = useState("");
  const [numeroFactura, setNumeroFactura] = useState(null);

  const fechaActual = new Date().toLocaleDateString("es-EC");

  const cargarSiguienteNumero = async () => {
    try {
      const res = await obtenerSiguienteNumeroFactura();
      setNumeroFactura(res.data?.numeroFactura ?? null);
    } catch {
      setNumeroFactura(null);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await cargarSiguienteNumero();
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // -------------------------
  // AGREGAR PRODUCTO
  // -------------------------
  const agregarProducto = () => {
    setError("");

    if (!productoSeleccionado) {
      setError("Debe seleccionar un producto.");
      return;
    }

    const cantidad = Number(cantidadProducto);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      setError("La cantidad debe ser un número entero mayor que cero.");
      return;
    }

    if (cantidad > productoSeleccionado.stock) {
      setError("La cantidad no puede ser mayor al stock disponible.");
      return;
    }

    const existe = productos.find(
      (p) => p.productoId === productoSeleccionado.id,
    );

    if (existe) {
      setProductos(
        productos.map((p) =>
          p.productoId === productoSeleccionado.id
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p,
        ),
      );
    } else {
      setProductos([
        ...productos,
        {
          productoId: productoSeleccionado.id,
          nombre: productoSeleccionado.nombre,
          precio: productoSeleccionado.precio,
          cantidad,
        },
      ]);
    }

    setProductoSeleccionado(null);
    setCantidadProducto("");
  };

  // -------------------------
  // CAMBIAR CANTIDAD
  // -------------------------
  const cambiarCantidad = (id, cantidad) => {
    const nuevos = productos.map((p) =>
      p.productoId === id ? { ...p, cantidad: Number(cantidad) } : p,
    );
    setProductos(nuevos);
  };

  // -------------------------
  // ELIMINAR PRODUCTO
  // -------------------------
  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.productoId !== id));
  };

  // -------------------------
  // CALCULOS
  // -------------------------
  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  // -------------------------
  // GUARDAR FACTURA
  // -------------------------
  const guardar = async () => {
    setError("");
    setMensajeExito("");

    if (!cliente) {
      setError("Debe seleccionar un cliente.");
      return;
    }

    if (productos.length === 0) {
      setError("Debe agregar al menos un producto.");
      return;
    }

    try {
      await guardarFactura({
        clienteId: cliente.id,
        detalles: productos.map((p) => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
        })),
      });

      setMensajeExito("Factura generada correctamente 🎉");

      setCliente(null);
      setProductos([]);
      await cargarSiguienteNumero();
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje || "Error al generar factura.";

      setError(mensaje);
    }
  };

  // -------------------------
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#556B2F]">Facturación</h1>

        {/* CABECERA FACTURA */}
        <div className="border rounded-xl overflow-hidden mb-6">
          <div className="grid grid-cols-2 bg-yellow-100 border-b">
            <div className="p-3 font-semibold">
              Número de factura:{" "}
              <span className="font-normal">
                {numeroFactura ? `FAC-${numeroFactura}` : "Cargando..."}
              </span>
            </div>

            <div className="p-3 font-semibold text-right">
              Fecha: <span className="font-normal">{fechaActual}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-0">
            <div className="border-r p-3 space-y-2">
              <p>
                <span className="font-semibold">Id:</span>{" "}
                {cliente ? cliente.id : ""}
              </p>
              <p>
                <span className="font-semibold">Nombre:</span>{" "}
                {cliente ? cliente.nombre : ""}
              </p>
              <p>
                <span className="font-semibold">Apellido:</span>{" "}
                {cliente ? cliente.apellido : ""}
              </p>
            </div>

            <div className="border-r p-3 space-y-2">
              <p>
                <span className="font-semibold">Teléfono:</span>{" "}
                {cliente ? (cliente.telefono?.valor ?? cliente.telefono) : ""}
              </p>
              <p>
                <span className="font-semibold">Dirección:</span>{" "}
                {cliente ? cliente.direccion : ""}
              </p>
              <p>
                <span className="font-semibold">Correo:</span>{" "}
                {cliente ? (cliente.correo?.valor ?? cliente.correo) : ""}
              </p>
            </div>

            <div className="p-3 flex flex-col justify-center gap-3">
              {!cliente ? (
                <button
                  onClick={() => setMostrarModalCliente(true)}
                  className="bg-[#556B2F] text-white px-4 py-2 rounded-lg hover:bg-[#445622]"
                >
                  Buscar cliente
                </button>
              ) : (
                <button
                  onClick={() => setCliente(null)}
                  className="border border-[#556B2F] text-[#556B2F] px-4 py-2 rounded-lg hover:bg-[#eef0e8]"
                >
                  Quitar cliente
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Productos</h2>

          <button
            onClick={() => setMostrarModalProducto(true)}
            className="bg-[#556B2F] text-white px-4 py-2 rounded mb-3"
          >
            Buscar producto
          </button>
          <div className="grid grid-cols-6 gap-2 items-center bg-[#f4f6ec] border border-[#d6e2b3] rounded-lg p-3 mb-4">
            <div>
              <strong>Id:</strong>{" "}
              {productoSeleccionado ? productoSeleccionado.id : "-"}
            </div>

            <div>
              <strong>Nombre:</strong>{" "}
              {productoSeleccionado ? productoSeleccionado.nombre : "-"}
            </div>

            <div>
              <strong>Precio:</strong>{" "}
              {productoSeleccionado ? `$${productoSeleccionado.precio}` : "-"}
            </div>

            <div>
              <strong>Stock:</strong>{" "}
              {productoSeleccionado ? productoSeleccionado.stock : "-"}
            </div>

            <input
              type="number"
              min="1"
              value={cantidadProducto}
              onChange={(e) => setCantidadProducto(e.target.value)}
              placeholder="Cantidad"
              disabled={!productoSeleccionado}
              className="border rounded-lg px-3 py-2 disabled:bg-gray-100"
            />

            <button
              onClick={agregarProducto}
              disabled={!productoSeleccionado}
              className="bg-[#556B2F] text-white px-4 py-2 rounded-lg disabled:opacity-40"
            >
              Agregar
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-2 text-left">Id</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-center">Precio</th>
                <th className="p-2 text-center">Cantidad</th>
                <th className="p-2 text-center">Precio * Unidad</th>
                <th className="p-2 text-center">Acción</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr
                  key={p.productoId}
                  className="border-b hover:bg-[#f7f8f2] transition"
                >
                  {/* ID */}
                  <td className="p-2 font-medium text-neutral-700">
                    {p.productoId}
                  </td>

                  {/* NOMBRE */}
                  <td className="p-2 text-neutral-800">{p.nombre}</td>

                  {/* PRECIO */}
                  <td className="p-2 text-center text-neutral-700">
                    ${p.precio}
                  </td>

                  {/* CANTIDAD (editable) */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={p.cantidad}
                      onChange={(e) =>
                        cambiarCantidad(p.productoId, e.target.value)
                      }
                      className="w-16 border border-neutral-300 rounded-lg text-center py-1 focus:outline-none focus:ring-2 focus:ring-[#636B2F]"
                    />
                  </td>

                  {/* PRECIO * UNIDAD */}
                  <td className="p-2 text-center font-semibold text-[#636B2F]">
                    ${(p.precio * p.cantidad).toFixed(2)}
                  </td>

                  {/* ACCIÓN */}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => eliminarProducto(p.productoId)}
                      className="text-[#636B2F] hover:bg-[#eef0e8] px-2 py-1 rounded transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {productos.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-neutral-500">
                    No hay productos agregados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TOTALES */}
        <div className="text-right space-y-2 mb-6">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>IVA (15%): ${iva.toFixed(2)}</p>
          <p className="font-bold text-lg">Total: ${total.toFixed(2)}</p>
        </div>

        {/* MENSAJES */}
        {error && <div className="text-red-500 mb-3">{error}</div>}

        {mensajeExito && (
          <div className="text-green-600 mb-3">{mensajeExito}</div>
        )}

        {/* BOTON */}
        <div className="text-right">
          <button
            onClick={guardar}
            className="bg-[#556B2F] text-white px-6 py-3 rounded"
          >
            Generar Factura
          </button>

          <button
            onClick={() =>
              generarFacturaPdf({ cliente, productos, subtotal, iva, total })
            }
            disabled={!cliente || productos.length === 0}
            className="bg-[#636B2F] text-white px-6 py-3 rounded disabled:opacity-40"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {mostrarModalCliente && (
        <ClienteSearchModal
          onClose={() => setMostrarModalCliente(false)}
          onSelect={(clienteSeleccionado) => {
            setCliente(clienteSeleccionado);
            setMostrarModalCliente(false);
          }}
        />
      )}

      {mostrarModalProducto && (
        <ProductoSearchModal
          onClose={() => setMostrarModalProducto(false)}
          onSelect={(producto) => {
            setProductoSeleccionado(producto);
            setCantidadProducto("");
            setMostrarModalProducto(false);
          }}
        />
      )}
    </div>
  );
}

export default FacturacionPage;
