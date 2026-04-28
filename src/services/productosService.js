import { api } from "../api/apiClient";

export const buscarProductos = (texto = "", pagina = 1, tamanio = 10) => {
  return api.get("/productos/buscar", {
    params: { texto, pagina, tamanio },
  });
};

export const obtenerProductoPorId = (id) => {
  return api.get(`/productos/${id}`);
};

export const crearProducto = (producto) => {
  return api.post("/productos", producto);
};

export const actualizarProducto = (id, producto) => {
  return api.put(`/productos/${id}`, producto);
};

export const eliminarProducto = (id) => {
  return api.delete(`/productos/${id}`);
};