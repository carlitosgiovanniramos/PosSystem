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

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        
        {/* HEADER */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">
            {titulo}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Completa la información del cliente.
          </p>
        </div>

        {/* BODY */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Nombre
                </label>
                <input
                  name="nombre"
                  value={formCliente.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Ana"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Apellido
                </label>
                <input
                  name="apellido"
                  value={formCliente.apellido}
                  onChange={manejarCambio}
                  placeholder="Ej: Pérez"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Teléfono
              </label>
              <input
                name="telefono"
                value={formCliente.telefono}
                onChange={manejarCambio}
                placeholder="0999999999"
                required
                maxLength="10"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Dirección
              </label>
              <input
                name="direccion"
                value={formCliente.direccion}
                onChange={manejarCambio}
                placeholder="Ej: Av. Principal y Bolívar"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formCliente.correo}
                onChange={manejarCambio}
                placeholder="cliente@email.com"
                required
                className={inputClass}
              />
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row gap-3 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#556B2F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#445622] transition shadow-sm"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClienteFormModal;