
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getProducts } from "../api/productApi";
import { getTransactions } from "../api/transactionApi";

const COLORS = [
  "#4f46e5",
  "#0891b2",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#db2777",
];

function DashboardCharts() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const [productResponse, transactionResponse] =
          await Promise.all([getProducts(), getTransactions()]);

        setProducts(
          Array.isArray(productResponse.data) ? productResponse.data : []
        );

        setTransactions(
          Array.isArray(transactionResponse.data)
            ? transactionResponse.data
            : []
        );
      } catch (err) {
        console.error("Dashboard chart loading failed:", err);
        setError("Unable to load dashboard charts.");
      }
    };

    loadChartData();
  }, []);

  const stockData = products
    .slice()
    .sort((a, b) => Number(b.quantity) - Number(a.quantity))
    .slice(0, 8)
    .map((product) => ({
      name: product.productName,
      quantity: Number(product.quantity) || 0,
    }));

  const categoryTotals = products.reduce((totals, product) => {
    const category = product.category || "Uncategorized";
    totals[category] =
      (totals[category] || 0) + (Number(product.quantity) || 0);
    return totals;
  }, {});

  const categoryData = Object.entries(categoryTotals).map(
    ([name, quantity]) => ({ name, quantity })
  );

  const movementTotals = transactions.reduce(
    (totals, transaction) => {
      const type = String(transaction.transactionType || "").toUpperCase();
      const quantity = Number(transaction.quantity) || 0;

      if (type === "IN") totals.stockIn += quantity;
      if (type === "OUT") totals.stockOut += quantity;

      return totals;
    },
    { stockIn: 0, stockOut: 0 }
  );

  const movementData = [
    { name: "Stock IN", quantity: movementTotals.stockIn },
    { name: "Stock OUT", quantity: movementTotals.stockOut },
  ];

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <section className="dashboard-charts">
      <div className="chart-card">
        <h3>Stock Overview</h3>
        <p className="chart-description">
          Top 8 products by available quantity
        </p>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quantity" fill="#4f46e5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Category-wise Inventory</h3>
        <p className="chart-description">
          Total units grouped by category
        </p>

        <div className="chart-container">
          {categoryData.length === 0 ? (
            <p>No category data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="quantity"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="chart-card">
        <h3>Stock Movement</h3>
        <p className="chart-description">
          Total quantities recorded as stock IN and OUT
        </p>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quantity" radius={[5, 5, 0, 0]}>
                <Cell fill="#16a34a" />
                <Cell fill="#ea580c" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default DashboardCharts;
