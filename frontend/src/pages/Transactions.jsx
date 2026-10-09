
import { useEffect, useMemo, useState } from "react";

import { getProducts } from "../api/productApi";
import {
    getTransactions,
    addStockTransaction
} from "../api/transactionApi";

const PAGE_SIZE = 10;

function Transactions() {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [productId, setProductId] = useState("");
    const [type, setType] = useState("IN");
    const [quantity, setQuantity] = useState("");

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadData = async () => {
        try {
            setError("");

            const [productResponse, transactionResponse] =
                await Promise.all([
                    getProducts(),
                    getTransactions()
                ]);

            setProducts(productResponse.data);
            setTransactions(transactionResponse.data);
        } catch (err) {
            console.error(err);
            setError(
                "Unable to load products or transactions. Check your login and backend."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const selectedProduct = products.find(
        (product) => product.id === productId
    );

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const matchesSearch = (
                transaction.productName || ""
            ).toLowerCase().includes(search.trim().toLowerCase());

            const matchesType =
                typeFilter === "ALL" ||
                transaction.transactionType === typeFilter;

            const transactionDate = transaction.transactionDate
                ? new Date(transaction.transactionDate)
                : null;

            const matchesStartDate =
                !startDate ||
                (transactionDate &&
                    !Number.isNaN(transactionDate.getTime()) &&
                    transactionDate >= new Date(`${startDate}T00:00:00`));

            const matchesEndDate =
                !endDate ||
                (transactionDate &&
                    !Number.isNaN(transactionDate.getTime()) &&
                    transactionDate < new Date(
                        new Date(`${endDate}T00:00:00`).getTime() +
                        24 * 60 * 60 * 1000
                    ));

            return (
                matchesSearch &&
                matchesType &&
                matchesStartDate &&
                matchesEndDate
            );
        });
    }, [transactions, search, typeFilter, startDate, endDate]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredTransactions.length / PAGE_SIZE)
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedTransactions = filteredTransactions.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, typeFilter, startDate, endDate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const amount = Number(quantity);

        if (!productId) {
            setError("Please select a product.");
            return;
        }

        if (!Number.isInteger(amount) || amount <= 0) {
            setError("Quantity must be a positive whole number.");
            return;
        }

        if (
            type === "OUT" &&
            selectedProduct &&
            amount > selectedProduct.quantity
        ) {
            setError(
                `Only ${selectedProduct.quantity} units are available.`
            );
            return;
        }

        try {
            setSaving(true);

            await addStockTransaction(productId, type, amount);

            setSuccess(
                type === "IN"
                    ? "Stock added successfully."
                    : "Stock issued successfully."
            );

            setQuantity("");
            setCurrentPage(1);

            await loadData();
        } catch (err) {
            console.error(err);

            const message = err.response?.data;

            setError(
                typeof message === "string"
                    ? message
                    : message?.message ||
                      "Unable to record stock movement."
            );
        } finally {
            setSaving(false);
        }
    };

    const resetFilters = () => {
        setSearch("");
        setTypeFilter("ALL");
        setStartDate("");
        setEndDate("");
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="page">
                <p className="loading-state">
                    Loading transactions...
                </p>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h2>Stock Transactions</h2>
                <p>Manage stock movements and review transaction history.</p>
            </div>

            {error && (
                <div className="error-message">{error}</div>
            )}

            {success && (
                <div className="success-message">{success}</div>
            )}

            <div className="form-card">
                <h3>Record Stock Movement</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Select Product *</label>
                            <select
                                value={productId}
                                onChange={(event) =>
                                    setProductId(event.target.value)
                                }
                                required
                            >
                                <option value="">Choose a product</option>

                                {products.map((product) => (
                                    <option
                                        key={product.id}
                                        value={product.id}
                                    >
                                        {product.productName}
                                        {" (Stock: "}
                                        {product.quantity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Transaction Type *</label>
                            <select
                                value={type}
                                onChange={(event) =>
                                    setType(event.target.value)
                                }
                            >
                                <option value="IN">Stock IN</option>
                                <option value="OUT">Stock OUT</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Quantity *</label>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={quantity}
                                onChange={(event) =>
                                    setQuantity(event.target.value)
                                }
                                placeholder="Enter quantity"
                                required
                            />
                        </div>
                    </div>

                    {selectedProduct && (
                        <p className="stock-info">
                            Current stock:{" "}
                            <strong>{selectedProduct.quantity}</strong>
                        </p>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={saving || products.length === 0}
                        >
                            {saving
                                ? "Processing..."
                                : type === "IN"
                                    ? "Add Stock"
                                    : "Issue Stock"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-card transaction-history">
                <div className="table-header">
                    <h3>Transaction History</h3>
                    <span>
                        {filteredTransactions.length} matching transactions
                    </span>
                </div>

                <div className="transaction-filters">
                    <div className="form-group">
                        <label>Search Product</label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Transaction Type</label>
                        <select
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(event.target.value)
                            }
                        >
                            <option value="ALL">All Types</option>
                            <option value="IN">Stock IN</option>
                            <option value="OUT">Stock OUT</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>From Date</label>
                        <input
                            type="date"
                            value={startDate}
                            max={endDate || undefined}
                            onChange={(event) =>
                                setStartDate(event.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>To Date</label>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate || undefined}
                            onChange={(event) =>
                                setEndDate(event.target.value)
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={resetFilters}
                    >
                        Clear Filters
                    </button>
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="empty-state">
                        No transactions match the selected filters.
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                        <th>Date &amp; Time</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>{transaction.productName}</td>
                                            <td>
                                                <span
                                                    className={
                                                        transaction.transactionType === "IN"
                                                            ? "status-badge status-in"
                                                            : "status-badge status-out"
                                                    }
                                                >
                                                    {transaction.transactionType}
                                                </span>
                                            </td>
                                            <td>{transaction.quantity}</td>
                                            <td>
                                                {transaction.transactionDate
                                                    ? new Date(
                                                        transaction.transactionDate
                                                    ).toLocaleString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination">
                            <span>
                                Showing{" "}
                                {(safePage - 1) * PAGE_SIZE + 1}–{" "}
                                {Math.min(
                                    safePage * PAGE_SIZE,
                                    filteredTransactions.length
                                )}{" "}
                                of {filteredTransactions.length}
                            </span>

                            <div className="pagination-buttons">
                                <button
                                    type="button"
                                    className="refresh-button"
                                    disabled={safePage === 1}
                                    onClick={() =>
                                        setCurrentPage((page) => page - 1)
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    Page {safePage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    className="refresh-button"
                                    disabled={safePage >= totalPages}
                                    onClick={() =>
                                        setCurrentPage((page) => page + 1)
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Transactions;
