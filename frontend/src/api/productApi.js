import api from "./axios";

export const getProducts = () => {
    return api.get("/products");
};

export const getProduct = (id) => {
    return api.get(`/products/${id}`);
};

export const addProduct = (product) => {
    return api.post("/products", product);
};

export const updateProduct = (id, product) => {
    return api.put(`/products/${id}`, product);
};

export const deleteProduct = (id) => {
    return api.delete(`/products/${id}`);
};

export const searchProducts = (name) => {
    return api.get(`/products/search?name=${name}`);
};

export const getLowStockProducts = () => {
    return api.get("/products/low-stock");
};