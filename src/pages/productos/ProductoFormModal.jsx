function ProductoFormModal({
  titulo,
  formProducto,
  setFormProducto,
  onClose,
  onSubmit,
  error,
}) {
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormProducto({
      ...formProducto,
      [name]: value,
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200">
        
        {/* HEADER */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">
            {titulo}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Ingresa la información del producto
          </p>
        </div>

        {/* BODY */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            
            {/* NOMBRE */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Nombre
              </label>
              <input
                name="nombre"
                value={formProducto.nombre}
                onChange={manejarCambio}
                placeholder="Ej: Coca Cola 1L"
                required
                className={inputClass}
              />
            </div>

            {/* PRECIO Y STOCK */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formProducto.precio}
                  onChange={manejarCambio}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formProducto.stock}
                  onChange={manejarCambio}
                  placeholder="0"
                  required
                  min="0"
                  step="1"
                  className={inputClass}
                />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#556B2F] py-3 text-sm font-semibold text-white hover:bg-[#445622] transition shadow-sm"
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

export default ProductoFormModal;