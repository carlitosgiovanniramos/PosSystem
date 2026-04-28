function ProductoDeleteModal({ producto, onClose, onConfirm, error }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
        
        {/* HEADER */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900">
            Eliminar producto
          </h2>

          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Esta acción eliminará el producto de forma permanente.
          </p>
        </div>

        {/* BODY */}
        <div className="px-6 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 mb-4">
            <p className="text-xs font-medium text-slate-500">
              Producto seleccionado
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {producto.nombre}
            </p>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed mb-5">
            ¿Estás seguro de que deseas continuar? Esta acción no se puede
            deshacer.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition shadow-sm"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDeleteModal;