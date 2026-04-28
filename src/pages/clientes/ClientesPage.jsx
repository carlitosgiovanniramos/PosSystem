import { useEffect, useState } from "react";
import {
  buscarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../../services/clientesService";
import ClienteFormModal from "./ClienteFormModal";
import ClienteDeleteModal from "./ClienteDeleteModal";

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [texto, setTexto] = useState("");
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteEditandoId, setClienteEditandoId] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [clienteEliminar, setClienteEliminar] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState("");

  const [formCliente, setFormCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    correo: "",
  });

  const tamanio = 5;

  const cargarClientes = async () => {
    try {
      const response = await buscarClientes(texto, pagina, tamanio);
      setClientes(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await cargarClientes();
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  const buscar = () => {
    if (pagina === 1) {
      cargarClientes();
    } else {
      setPagina(1);
    }
  };

  const abrirModalNuevo = () => {
    setErrorModal("");
    setFormCliente({
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      correo: "",
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (cliente) => {
    setErrorModal("");
    setModoEdicion(true);
    setClienteEditandoId(cliente.id);

    setFormCliente({
      id: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono?.valor ?? cliente.telefono,
      direccion: cliente.direccion,
      correo: cliente.correo?.valor ?? cliente.correo,
    });

    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setErrorModal("");
    setModoEdicion(false);
    setClienteEditandoId(null);
  };

  const guardarNuevoCliente = async (e) => {
    e.preventDefault();
    setErrorModal("");

    try {
      await crearCliente(formCliente);
      setMostrarModal(false);
      await cargarClientes();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje ||
        "No se pudo crear el cliente. Verifique los datos.";

      setErrorModal(mensaje);
    }
  };

  const guardarEdicionCliente = async (e) => {
    e.preventDefault();
    setErrorModal("");

    try {
      await actualizarCliente(clienteEditandoId, formCliente);
      cerrarModal();
      await cargarClientes();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje ||
        "No se pudo actualizar el cliente. Verifique los datos.";

      setErrorModal(mensaje);
    }
  };

  const abrirModalEliminar = (cliente) => {
    setClienteEliminar(cliente);
    setErrorEliminar("");
    setMostrarModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    setMostrarModalEliminar(false);
    setClienteEliminar(null);
    setErrorEliminar("");
  };

  const confirmarEliminarCliente = async () => {
    try {
      await eliminarCliente(clienteEliminar.id);
      cerrarModalEliminar();
      await cargarClientes();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "No se pudo eliminar el cliente.";

      setErrorEliminar(mensaje);
    }
  };

  const totalPaginas = Math.ceil(total / tamanio);

  return (
    <div className="min-h-screen bg-[#f4f6f2] p-6 md:p-10 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-7 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#556B2F] mb-2">
                Módulo de clientes
              </p>

              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Clientes
              </h1>

              <p className="text-slate-500 mt-1 text-sm">
                Gestión y control de tu cartera de clientes
              </p>
            </div>

            <button
              onClick={abrirModalNuevo}
              className="bg-[#556B2F] hover:bg-[#445622] text-white rounded-2xl px-5 py-3 font-semibold shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              Nuevo cliente
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total clientes</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {total}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Página actual</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {pagina}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#556B2F]/5 p-5">
              <p className="text-sm text-slate-500">Clientes visibles</p>
              <h3 className="text-2xl font-bold text-[#556B2F] mt-1">
                {clientes.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Buscar por ID o apellido..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:border-[#556B2F] focus:ring-4 focus:ring-[#556B2F]/10"
            />

            <button
              onClick={buscar}
              className="bg-[#556B2F] hover:bg-[#445622] text-white rounded-2xl px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Nombre</th>
                <th className="p-4 text-left font-semibold">Apellido</th>
                <th className="p-4 text-left font-semibold">Teléfono</th>
                <th className="p-4 text-left font-semibold">Dirección</th>
                <th className="p-4 text-left font-semibold">Correo</th>
                <th className="p-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b border-slate-100 hover:bg-[#556B2F]/5 transition-colors text-sm text-slate-700"
                >
                  <td className="p-4 font-semibold text-slate-500">
                    #{cliente.id}
                  </td>
                  <td className="p-4 font-medium text-slate-900">
                    {cliente.nombre}
                  </td>
                  <td className="p-4">{cliente.apellido}</td>
                  <td className="p-4">
                    {cliente.telefono?.valor ?? cliente.telefono}
                  </td>
                  <td className="p-4">{cliente.direccion}</td>
                  <td className="p-4">
                    {cliente.correo?.valor ?? cliente.correo}
                  </td>
                  <td className="p-4 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => abrirModalEditar(cliente)}
                      className="text-[#556B2F] hover:bg-[#556B2F]/10 px-3 py-1.5 rounded-xl transition-all duration-200 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => abrirModalEliminar(cliente)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all duration-200 font-semibold"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {clientes.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 px-6 text-center text-slate-500 font-medium"
                  >
                    No se encontraron clientes
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
        <ClienteFormModal
          titulo={modoEdicion ? "Editar cliente" : "Nuevo cliente"}
          formCliente={formCliente}
          setFormCliente={setFormCliente}
          onClose={cerrarModal}
          onSubmit={modoEdicion ? guardarEdicionCliente : guardarNuevoCliente}
          error={errorModal}
        />
      )}

      {mostrarModalEliminar && clienteEliminar && (
        <ClienteDeleteModal
          cliente={clienteEliminar}
          onClose={cerrarModalEliminar}
          onConfirm={confirmarEliminarCliente}
          error={errorEliminar}
        />
      )}
    </div>
  );
}

export default ClientesPage;