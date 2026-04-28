function ClienteDeleteModal({ cliente, onClose, onConfirm, error }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-neutral-100 transform transition-all text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold text-neutral-800 tracking-tight mb-2">
          Eliminar cliente
        </h2>

        <p className="text-neutral-500 mb-8 text-sm leading-relaxed">
          ¿Estás seguro de que deseas eliminar permanentemente a{" "}
          <span className="font-bold text-neutral-800">
            {cliente.nombre} {cliente.apellido}
          </span>
          ? Esta acción no se puede deshacer.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-100 text-left">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-neutral-600 font-medium hover:bg-neutral-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-olive-700 text-white font-medium hover:bg-olive-800 shadow-sm transition-colors"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClienteDeleteModal;