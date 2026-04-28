import { api } from "../api/apiClient";

export const guardarFactura = (factura) => {
  return api.post("/facturas", factura);
};

export const obtenerFacturaPorId = (id) => {
  return api.get(`/facturas/${id}`);
};

export const obtenerSiguienteNumeroFactura = () => {
  return api.get("/facturas/siguiente-numero");
};


export const buscarFacturas = (
  numeroFactura = null,
  clienteId = null,
  pagina = 1,
  tamanio = 10
) => {
  return api.get("/facturas/buscar", {
    params: {
      numeroFactura,
      clienteId,
      pagina,
      tamanio,
    },
  });
};