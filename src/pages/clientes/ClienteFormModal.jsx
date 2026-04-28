function ClienteFormModal({
  titulo,
  formCliente,
  setFormCliente,
  onClose,
  onSubmit,
  error,
}) {
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormCliente({
      ...formCliente,
      [name]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 border border-neutral-100 transform transition-all">
        <h2 className="text-2xl font-extrabold text-[#636B2F] tracking-tight mb-1">{titulo}</h2>

        <p className="text-sm text-neutral-500 mb-6 font-medium">
          Todos los campos son obligatorios.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="nombre"
            value={formCliente.nombre}
            onChange={manejarCambio}
            placeholder="Nombre"
            required
            className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 outline-none focus:border-[#636B2F] focus:ring-1 focus:ring-[#636B2F] focus:bg-white transition-all text-sm text-neutral-700 placeholder:text-neutral-400"
          />

          <input
            name="apellido"
            value={formCliente.apellido}
            onChange={manejarCambio}
            placeholder="Apellido"
            required
            className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 outline-none focus:border-[#636B2F] focus:ring-1 focus:ring-[#636B2F] focus:bg-white transition-all text-sm text-neutral-700 placeholder:text-neutral-400"
          />

          <input
            name="telefono"
            value={formCliente.telefono}
            onChange={manejarCambio}
            placeholder="Teléfono - 10 dígitos"
            required
            maxLength="10"
            className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 outline-none focus:border-[#636B2F] focus:ring-1 focus:ring-[#636B2F] focus:bg-white transition-all text-sm text-neutral-700 placeholder:text-neutral-400"
          />

          <input
            name="direccion"
            value={formCliente.direccion}
            onChange={manejarCambio}
            placeholder="Dirección"
            required
            className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 outline-none focus:border-[#636B2F] focus:ring-1 focus:ring-[#636B2F] focus:bg-white transition-all text-sm text-neutral-700 placeholder:text-neutral-400"
          />

          <input
            type="email"
            name="correo"
            value={formCliente.correo}
            onChange={manejarCambio}
            placeholder="Correo"
            required
            className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 outline-none focus:border-[#636B2F] focus:ring-1 focus:ring-[#636B2F] focus:bg-white transition-all text-sm text-neutral-700 placeholder:text-neutral-400"
          />

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 font-medium transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#636B2F] text-white hover:bg-[#4f5625] font-medium shadow-sm transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClienteFormModal;