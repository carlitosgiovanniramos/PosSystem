import { api } from "../api/apiClient";

export const buscarClientes = (texto = "", pagina = 1, tamanio = 10) => {
  return api.get("/clientes/buscar", {
    params: { texto, pagina, tamanio },
  });
};

export const obtenerClientePorId = (id) => {
  return api.get(`/clientes/${id}`);
};

export const crearCliente = (cliente) => {
  return api.post("/clientes", cliente);
};

export const actualizarCliente = (id, cliente) => {
  return api.put(`/clientes/${id}`, cliente);
};

export const eliminarCliente = (id) => {
  return api.delete(`/clientes/${id}`);
};