
import api from "./axios";

export const getTransactions = () =>
    api.get("/transactions");

export const addStockTransaction = (productId, type, quantity) =>
    api.post("/transactions", null, {
        params: {
            productId,
            type,
            quantity
        }
    });
