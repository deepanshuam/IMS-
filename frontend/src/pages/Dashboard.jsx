
import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import { getTransactions } from "../api/transactionApi";
import StatCard from "../components/StatCard";
import DashboardCharts from "../components/DashboardCharts";

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async () => {
        try {
            setError("");

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
            console.error("Dashboard loading failed:", err);
            setError(
                "Unable to load dashboard data. Please check that the backend is running."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const totalProducts = products.length;

    const totalQuantity = products.reduce(
        (total, product) =>
            total + Number(product.quantity || 0),
        0
    );

    const lowStockProducts = products.filter(
        (product) =>
            Number(product.quantity || 0) <=
            Number(product.minStock || 0)
    );

    const totalInventoryValue = products.reduce(
        (total, product) =>
            total +
            Number(product.quantity || 0) *
            Number(product.price || 0),
        0
    );

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(amount);

    const recentTransactions = transactions.slice(0, 5);

    if (loading) {
        return (
            <div className="page">
                <p className="loading-state">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header dashboard-header">
                <div>
                    <h2>Dashboard</h2>
                    <p>
                        Overview of your inventory operations.
                    </p>
                </div>

                <button
                    type="button"
                    className="refresh-button"
                    onClick={loadDashboard}
                    disabled={loading}
                >
                    Refresh Data
                </button>
            </div>

            {error && (
                <div className="error-message" role="alert">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={loadDashboard}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Inventory statistics */}
            <div className="stats-grid">
                <StatCard
                    title="Total Products"
                    value={totalProducts}
                    description="Distinct products in inventory"
                />

                <StatCard
                    title="Total Stock"
                    value={totalQuantity.toLocaleString("en-IN")}
                    description="Units currently available"
                />

                <StatCard
                    title="Low Stock Items"
                    value={lowStockProducts.length}
                    description="At or below minimum stock"
                />

                <StatCard
                    title="Inventory Value"
                    value={formatCurrency(totalInventoryValue)}
                    description="Based on quantity × unit price"
                />
            </div>

            {/* Inventory charts */}
            <div className="dashboard-section">
                <DashboardCharts />
            </div>

            {/* Low stock products */}
            <div className="table-card dashboard-section">
                <div className="table-header">
                    <h3>Low Stock Products</h3>
                    <span>{lowStockProducts.length} items</span>
                </div>

                {lowStockProducts.length === 0 ? (
                    <div className="empty-state">
                        No low-stock products found.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Product Code</th>
                                    <th>Current Stock</th>
                                    <th>Minimum Stock</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lowStockProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.productName}</td>
                                        <td>{product.productCode}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.minStock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Recent transactions */}
            <div className="table-card dashboard-section">
                <div className="table-header">
                    <h3>Recent Transactions</h3>
                    <span>
                        Showing {recentTransactions.length} of{" "}
                        {transactions.length}
                    </span>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="empty-state">
                        No stock transactions have been recorded yet.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Transaction Type</th>
                                    <th>Quantity</th>
                                    <th>Date &amp; Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentTransactions.map((transaction) => (
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
