import { useState } from "react";
import ClientesPage from "./pages/clientes/ClientesPage";
import ProductosPage from "./pages/productos/ProductosPage";
import FacturacionPage from "./pages/facturacion/FacturacionPage";
import FacturaConsultaPage from "./pages/facturas/FacturaConsultaPage";

function App() {
  const [vistaActual, setVistaActual] = useState("clientes");

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden font-sans">
      {/* SIDEBAR PANEL DE NAVEGACION */}
      <aside className="w-64 bg-white border-r border-neutral-100 flex flex-col shadow-sm z-10 transition-all duration-300">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-center">
          <h1 className="text-2xl font-extrabold text-[#636B2F] tracking-tight">
            POS<span className="text-neutral-800">System</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setVistaActual("clientes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              vistaActual === "clientes"
                ? "bg-[#636B2F] text-white shadow-md shadow-[#636B2F]/20"
                : "text-neutral-600 hover:bg-[#636B2F]/10 hover:text-[#636B2F]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            Clientes
          </button>

          <button
            onClick={() => setVistaActual("productos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              vistaActual === "productos"
                ? "bg-[#636B2F] text-white shadow-md shadow-[#636B2F]/20"
                : "text-neutral-600 hover:bg-[#636B2F]/10 hover:text-[#636B2F]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
            Productos
          </button>

          <button
            onClick={() => setVistaActual("facturacion")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              vistaActual === "facturacion"
                ? "bg-[#636B2F] text-white shadow-md shadow-[#636B2F]/20"
                : "text-neutral-600 hover:bg-[#636B2F]/10 hover:text-[#636B2F]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Facturación
          </button>

          <button
            onClick={() => setVistaActual("consultaFacturas")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              vistaActual === "consultaFacturas"
                ? "bg-[#636B2F] text-white shadow-md shadow-[#636B2F]/20"
                : "text-neutral-600 hover:bg-[#636B2F]/10 hover:text-[#636B2F]"
            }`}
          >
            Consultar facturas
          </button>
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-500">
            <div className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-neutral-600">
              AD
            </div>
            <div>
              <p className="font-semibold text-neutral-800">Administrador</p>
              <p className="text-xs">Sistema POS</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 overflow-y-auto bg-neutral-50">
        {vistaActual === "clientes" && <ClientesPage />}
        {vistaActual === "productos" && <ProductosPage />}
        {vistaActual === "facturacion" && <FacturacionPage />}
        {vistaActual === "facturas" && <FacturaConsultaPage />}
        {vistaActual === "consultaFacturas" && <FacturaConsultaPage />}
      </main>
    </div>
  );
}

export default App;
