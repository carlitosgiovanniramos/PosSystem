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
  }, []);

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
      const nuevaCantidad = existe.cantidad + cantidad;

      if (nuevaCantidad > productoSeleccionado.stock) {
        setError("La cantidad no puede ser mayor al stock disponible.");
        return;
      }

      setProductos(
        productos.map((p) =>
          p.productoId === productoSeleccionado.id
            ? { ...p, cantidad: nuevaCantidad }
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
          stock: productoSeleccionado.stock,
          cantidad,
        },
      ]);
    }

    setProductoSeleccionado(null);
    setCantidadProducto("");
  };

  const cambiarCantidad = (id, cantidad) => {
    const cantidadNumerica = Number(cantidad);

    const nuevos = productos.map((p) => {
      if (p.productoId !== id) return p;

      if (!Number.isInteger(cantidadNumerica) || cantidadNumerica <= 0) {
        return { ...p, cantidad: 1 };
      }

      if (p.stock != null && cantidadNumerica > p.stock) {
        setError("La cantidad no puede ser mayor al stock disponible.");
        return { ...p, cantidad: p.stock };
      }

      return { ...p, cantidad: cantidadNumerica };
    });

    setProductos(nuevos);
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.productoId !== id));
  };

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

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

      setMensajeExito("Factura generada correctamente.");
      await cargarSiguienteNumero();
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje || "Error al generar factura.";

      setError(mensaje);
    }
  };

  const limpiarFactura = async () => {
    setCliente(null);
    setProductos([]);
    setProductoSeleccionado(null);
    setCantidadProducto("");
    setError("");
    setMensajeExito("");
    await cargarSiguienteNumero();
  };

  return (
    <div className="min-h-screen bg-[#f3f5ef] px-4 py-6 md:px-8 md:py-10 text-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
          {/* CABECERA TIPO FACTURA */}
          <div className="px-6 md:px-8 py-7 border-b border-slate-200 bg-gradient-to-r from-white to-[#f7f8f3]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#556B2F]">
                  Punto de venta
                </p>

                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  Factura
                </h1>

                <p className="text-sm text-slate-500 mt-2 max-w-xl">
                  Registra los datos del cliente, agrega productos al detalle y
                  genera el comprobante de venta.
                </p>
              </div>

              <div className="w-full lg:w-auto rounded-3xl border border-[#556B2F]/20 bg-white px-6 py-5 shadow-sm">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">
                      Factura No.
                    </p>
                    <p className="font-bold text-[#556B2F] mt-1">
                      {numeroFactura ? `FAC-${numeroFactura}` : "Cargando..."}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">
                      Fecha
                    </p>
                    <p className="font-bold text-slate-900 mt-1">
                      {fechaActual}
                    </p>
                  </div>

                  <div className="col-span-2 border-t border-slate-100 pt-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">
                      Total actual
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CUERPO PRINCIPAL */}
          <div className="p-6 md:p-8 space-y-8">
            {/* DATOS CLIENTE */}
            <section className="rounded-3xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-[#fafbf7] border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Datos del cliente
                  </h2>
                  <p className="text-sm text-slate-500">
                    Información del comprador de la factura.
                  </p>
                </div>

                {!cliente ? (
                  <button
                    onClick={() => setMostrarModalCliente(true)}
                    className="rounded-2xl bg-[#556B2F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#465826] transition-all active:scale-[0.98]"
                  >
                    Buscar cliente
                  </button>
                ) : (
                  <button
                    onClick={() => setCliente(null)}
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    Quitar cliente
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Cliente
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {cliente
                      ? `${cliente.nombre} ${cliente.apellido}`
                      : "Sin cliente seleccionado"}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Identificación
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {cliente ? cliente.id : "-"}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Contacto
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {cliente ? (cliente.telefono?.valor ?? cliente.telefono) : "-"}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {cliente ? (cliente.correo?.valor ?? cliente.correo) : "-"}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Dirección
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {cliente ? cliente.direccion : "-"}
                  </p>
                </div>
              </div>
            </section>

            {/* AGREGAR PRODUCTO */}
            <section className="rounded-3xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-[#fafbf7] border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Agregar producto
                  </h2>
                  <p className="text-sm text-slate-500">
                    Selecciona un producto y define la cantidad.
                  </p>
                </div>

                <button
                  onClick={() => setMostrarModalProducto(true)}
                  className="rounded-2xl bg-[#556B2F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#465826] transition-all active:scale-[0.98]"
                >
                  Buscar producto
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      ID
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {productoSeleccionado ? productoSeleccionado.id : "-"}
                    </p>
                  </div>

                  <div className="lg:col-span-2">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Producto
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {productoSeleccionado ? productoSeleccionado.nombre : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Precio / Stock
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {productoSeleccionado
                        ? `$${productoSeleccionado.precio} / ${productoSeleccionado.stock}`
                        : "-"}
                    </p>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={cantidadProducto}
                    onChange={(e) => setCantidadProducto(e.target.value)}
                    placeholder="Cantidad"
                    disabled={!productoSeleccionado}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10 disabled:bg-slate-100 disabled:text-slate-400"
                  />

                  <button
                    onClick={agregarProducto}
                    disabled={!productoSeleccionado}
                    className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-[#556B2F] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </section>

            {/* DETALLE FACTURA */}
            <section className="rounded-3xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-[#fafbf7] border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">
                  Detalle de la factura
                </h2>
                <p className="text-sm text-slate-500">
                  Lista de productos incluidos en la venta.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-4 text-left font-bold">Código</th>
                      <th className="px-5 py-4 text-left font-bold">Producto</th>
                      <th className="px-5 py-4 text-center font-bold">Precio</th>
                      <th className="px-5 py-4 text-center font-bold">
                        Cantidad
                      </th>
                      <th className="px-5 py-4 text-right font-bold">
                        Subtotal
                      </th>
                      <th className="px-5 py-4 text-center font-bold">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {productos.map((p) => (
                      <tr
                        key={p.productoId}
                        className="border-b border-slate-100 hover:bg-[#f8faf4] transition"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-500">
                          #{p.productoId}
                        </td>

                        <td className="px-5 py-4 font-bold text-slate-900">
                          {p.nombre}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-slate-700">
                          ${Number(p.precio).toFixed(2)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <input
                            type="number"
                            min="1"
                            max={p.stock ?? undefined}
                            value={p.cantidad}
                            onChange={(e) =>
                              cambiarCantidad(p.productoId, e.target.value)
                            }
                            className="w-24 rounded-xl border border-slate-300 bg-white py-2 text-center text-sm outline-none focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10"
                          />
                        </td>

                        <td className="px-5 py-4 text-right font-extrabold text-slate-900">
                          ${(p.precio * p.cantidad).toFixed(2)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => eliminarProducto(p.productoId)}
                            className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 transition"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}

                    {productos.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-12 text-center text-slate-500 font-medium"
                        >
                          Todavía no hay productos agregados a esta factura.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* MENSAJES */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {mensajeExito && (
              <div className="rounded-2xl border border-[#556B2F]/30 bg-[#556B2F]/10 px-5 py-3 text-sm font-semibold text-[#445622]">
                {mensajeExito}
              </div>
            )}

            {/* TOTALES */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-[#fafbf7] p-6">
                <h3 className="text-base font-bold text-slate-900">
                  Observación
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Verifica los datos del cliente y los productos antes de generar
                  la factura. El valor final incluye IVA del 15%.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-5">
                  Resumen de pago
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold text-slate-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">IVA 15%</span>
                    <span className="font-bold text-slate-900">
                      ${iva.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
                    <span className="text-base font-extrabold text-slate-900">
                      Total
                    </span>
                    <span className="text-3xl font-extrabold text-[#556B2F]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={guardar}
                    className="w-full rounded-2xl bg-[#556B2F] px-5 py-3 text-sm font-bold text-white hover:bg-[#465826] transition-all active:scale-[0.98]"
                  >
                    Generar factura
                  </button>

                  <button
                    onClick={() =>
                      generarFacturaPdf({
                        cliente,
                        productos,
                        subtotal,
                        iva,
                        total,
                      })
                    }
                    disabled={!cliente || productos.length === 0}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Exportar PDF
                  </button>

                  <button
                    onClick={limpiarFactura}
                    className="w-full rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"
                  >
                    Nueva factura
                  </button>
                </div>
              </div>
            </section>
          </div>
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