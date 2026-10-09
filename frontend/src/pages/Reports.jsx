
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/productApi";
import { getTransactions } from "../api/transactionApi";

function downloadCSV(filename, rows) {
    if (!rows.length) {
        alert("There is no data to export.");
        return;
    }

    const escapeCSV = (value) => {
        const text = String(value ?? "");
        return `"${text.replace(/"/g, '""')}"`;
    };

    const csv = rows
        .map((row) => row.map(escapeCSV).join(","))
        .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

function Reports() {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReports = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [productResponse, transactionResponse] =
                await Promise.all([
                    getProducts(),
                    getTransactions()
                ]);

            setProducts(
                Array.isArray(productResponse.data)
                    ? productResponse.data
                    : []
            );

            setTransactions(
                Array.isArray(transactionResponse.data)
                    ? transactionResponse.data
                    : []
            );
        } catch (err) {
            console.error("Reports loading failed:", err);
            setError("Unable to load reports. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(amount);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products.filter((product) =>
            [
                product.productName,
                product.productCode,
                product.category,
                product.supplier
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(query)
            )
        );
    }, [products, search]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const transactionDate = transaction.transactionDate
                ? String(transaction.transactionDate).slice(0, 10)
                : "";

            if (startDate && (!transactionDate || transactionDate < startDate)) {
                return false;
            }

            if (endDate && (!transactionDate || transactionDate > endDate)) {
                return false;
            }

            return true;
        });
    }, [transactions, startDate, endDate]);

    const totalUnits = products.reduce(
        (sum, product) => sum + Number(product.quantity || 0),
        0
    );

    const inventoryValue = products.reduce(
        (sum, product) =>
            sum +
            Number(product.quantity || 0) *
            Number(product.price || 0),
        0
    );

    const lowStockCount = products.filter(
        (product) =>
            Number(product.quantity || 0) <=
            Number(product.minStock || 0)
    ).length;

    const totalStockIn = filteredTransactions.reduce(
        (sum, transaction) =>
            sum +
            (transaction.transactionType === "IN"
                ? Number(transaction.quantity || 0)
                : 0),
        0
    );

    const totalStockOut = filteredTransactions.reduce(
        (sum, transaction) =>
            sum +
            (transaction.transactionType === "OUT"
                ? Number(transaction.quantity || 0)
                : 0),
        0
    );

    const exportInventory = () => {
        const rows = [
            [
                "Product Code",
                "Product Name",
                "Category",
                "Supplier",
                "Quantity",
                "Unit Price",
                "Inventory Value",
                "Minimum Stock",
                "Status"
            ],
            ...filteredProducts.map((product) => {
                const quantity = Number(product.quantity || 0);
                const minStock = Number(product.minStock || 0);

                return [
                    product.productCode,
                    product.productName,
                    product.category,
                    product.supplier,
                    quantity,
                    product.price,
                    quantity * Number(product.price || 0),
                    minStock,
                    quantity <= minStock ? "Low Stock" : "In Stock"
                ];
            })
        ];

        downloadCSV("inventory-report.csv", rows);
    };

    const exportTransactions = () => {
        const rows = [
            [
                "Transaction ID",
                "Product ID",
                "Product Name",
                "Transaction Type",
                "Quantity",
                "Transaction Date"
            ],
            ...filteredTransactions.map((transaction) => [
                transaction.id,
                transaction.productId,
                transaction.productName,
                transaction.transactionType,
                transaction.quantity,
                transaction.transactionDate
                    ? new Date(transaction.transactionDate).toLocaleString("en-IN")
                    : ""
            ])
        ];

        downloadCSV("transaction-report.csv", rows);
    };

    if (loading) {
        return (
            <div className="page">
                <p className="loading-state">Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h2>Reports</h2>
                    <p>Inventory valuation, stock levels, and transaction history.</p>
                </div>

                <button
                    type="button"
                    className="refresh-button"
                    onClick={loadReports}
                >
                    Refresh Reports
                </button>
            </div>

            {error && (
                <div className="error-message" role="alert">
                    {error}
                    <button type="button" onClick={loadReports}>
                        Retry
                    </button>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p>{products.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Units</h3>
                    <p>{totalUnits.toLocaleString("en-IN")}</p>
                </div>

                <div className="stat-card">
                    <h3>Low Stock Items</h3>
                    <p>{lowStockCount}</p>
                </div>

                <div className="stat-card">
                    <h3>Inventory Value</h3>
                    <p>{formatCurrency(inventoryValue)}</p>
                </div>
            </div>

            {/* Inventory report */}
            <section className="table-card report-section">
                <div className="table-header">
                    <h3>Inventory Report</h3>

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={exportInventory}
                    >
                        Export Inventory CSV
                    </button>
                </div>

                <div className="report-search">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search product, code, category, or supplier..."
                        aria-label="Search inventory report"
                    />
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Code</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Supplier</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Value</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="8">No products found.</td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const quantity = Number(product.quantity || 0);
                                    const minStock = Number(product.minStock || 0);

                                    return (
                                        <tr key={product.id}>
                                            <td>{product.productCode}</td>
                                            <td>{product.productName}</td>
                                            <td>{product.category}</td>
                                            <td>{product.supplier}</td>
                                            <td>{quantity}</td>
                                            <td>
                                                {formatCurrency(Number(product.price || 0))}
                                            </td>
                                            <td>
                                                {formatCurrency(
                                                    quantity * Number(product.price || 0)
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={
                                                        quantity <= minStock
                                                            ? "status-badge status-out"
                                                            : "status-badge status-in"
                                                    }
                                                >
                                                    {quantity <= minStock
                                                        ? "Low Stock"
                                                        : "In Stock"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Transaction report */}
            <section className="table-card report-section">
                <div className="table-header">
                    <h3>Transaction Report</h3>

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={exportTransactions}
                    >
                        Export Transactions CSV
                    </button>
                </div>

                <div className="transaction-filters">
                    <div className="form-group">
                        <label htmlFor="report-start-date">Start Date</label>
                        <input
                            id="report-start-date"
                            type="date"
                            value={startDate}
                            max={endDate || undefined}
                            onChange={(event) => setStartDate(event.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="report-end-date">End Date</label>
                        <input
                            id="report-end-date"
                            type="date"
                            value={endDate}
                            min={startDate || undefined}
                            onChange={(event) => setEndDate(event.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={() => {
                            setStartDate("");
                            setEndDate("");
                        }}
                    >
                        Clear Dates
                    </button>
                </div>

                <div className="report-summary">
                    <span>
                        Transactions: <strong>{filteredTransactions.length}</strong>
                    </span>
                    <span>
                        Stock IN: <strong>{totalStockIn}</strong> units
                    </span>
                    <span>
                        Stock OUT: <strong>{totalStockOut}</strong> units
                    </span>
                </div>

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
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4">
                                        No transactions found for the selected dates.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((transaction) => (
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
                                                ).toLocaleString("en-IN")
                                                : "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Reports;
