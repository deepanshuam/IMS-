
import api from "./axios";

export const getSuppliers = () => api.get("/suppliers");

export const addSupplier = (supplier) =>
    api.post("/suppliers", supplier);

export const getSupplier = (id) =>
    api.get(`/suppliers/${id}`);

export const updateSupplier = (id, supplier) =>
    api.put(`/suppliers/${id}`, supplier);

export const deleteSupplier = (id) =>
    api.delete(`/suppliers/${id}`);
