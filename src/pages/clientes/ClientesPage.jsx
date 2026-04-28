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
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10 font-sans text-neutral-800">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#636B2F] tracking-tight">
              Clientes...
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">
              Gestión y control de tu cartera de clientes
            </p>
          </div>

          <button
            onClick={abrirModalNuevo}
            className="bg-[#636B2F] hover:bg-[#4f5625] text-white px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 font-medium flex items-center gap-2"
          >
            Nuevo cliente
          </button>
        </div>

        <div className="flex gap-4 mb-8 bg-neutral-50 p-2 rounded-2xl border border-neutral-100">
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por ID o apellido..."
            className="w-full bg-transparent px-4 py-2 outline-none text-neutral-700 placeholder:text-neutral-400"
          />

          <button
            onClick={buscar}
            className="bg-[#636B2F] hover:bg-[#4f5625] text-white px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 font-medium flex items-center gap-2"
          >
            Buscar
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-neutral-100">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-[#636B2F]/10 text-[#636B2F] border-b border-[#636B2F]/20 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 text-left font-semibold rounded-tl-2xl">
                  ID
                </th>
                <th className="p-4 text-left font-semibold">Nombre</th>
                <th className="p-4 text-left font-semibold">Apellido</th>
                <th className="p-4 text-left font-semibold">Teléfono</th>
                <th className="p-4 text-left font-semibold">Dirección</th>
                <th className="p-4 text-left font-semibold">Correo</th>
                <th className="p-4 text-center font-semibold rounded-tr-2xl">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b border-neutral-50 hover:bg-[#636B2F]/5 transition-colors text-sm text-neutral-600"
                >
                  <td className="p-4 font-medium text-neutral-800">
                    {cliente.id}
                  </td>
                  <td className="p-4">{cliente.nombre}</td>
                  <td className="p-4">{cliente.apellido}</td>
                  <td className="p-4">
                    {cliente.telefono?.valor ?? cliente.telefono}
                  </td>
                  <td className="p-4">{cliente.direccion}</td>
                  <td className="p-4">
                    {cliente.correo?.valor ?? cliente.correo}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => abrirModalEditar(cliente)}
                      className="text-[#636B2F] hover:text-[#4f5625] hover:bg-[#636B2F]/10 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => abrirModalEliminar(cliente)}
                      className="text-olive-700 hover:text-white hover:bg-olive-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {clientes.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 px-6 text-center text-neutral-400 font-medium">
                    No se encontraron clientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
