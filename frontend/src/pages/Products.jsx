import { useEffect, useState } from "react";
import {
    getProducts,
    deleteProduct,
    searchProducts,
    getLowStockProducts
} from "../api/productApi";

import { Link } from "react-router-dom";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showLowStock, setShowLowStock] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getProducts();

            setProducts(response.data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load products."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleSearch = async () => {

        if (!search.trim()) {
            loadProducts();
            return;
        }

        try {

            setLoading(true);

            const response =
                await searchProducts(search);

            setProducts(response.data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to search products."
            );

        } finally {

            setLoading(false);
        }
    };

    const handleLowStock = async () => {

        try {

            setLoading(true);
            setShowLowStock(true);

            const response =
                await getLowStockProducts();

            setProducts(response.data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load low stock products."
            );

        } finally {

            setLoading(false);
        }
    };

    const handleShowAll = () => {

        setShowLowStock(false);
        setSearch("");

        loadProducts();
    };

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteProduct(id);

            setProducts(
                products.filter(
                    (product) =>
                        product.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to delete product."
            );
        }
    };

    return (

        <div className="page">

            {/* Header */}

            <div className="page-header product-header">

                <div>
                    <h2>Products</h2>

                    <p>
                        Manage all inventory products
                    </p>
                </div>

                <Link
                    to="/products/add"
                    className="add-button"
                >
                    + Add Product
                </Link>

            </div>

            {/* Toolbar */}

            <div className="product-toolbar">

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Search product name..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                handleSearch();
                            }

                        }}
                    />

                    <button
                        onClick={handleSearch}
                    >
                        Search
                    </button>

                </div>

                <div className="toolbar-buttons">

                    <button
                        className={
                            showLowStock
                                ? "low-stock-button active"
                                : "low-stock-button"
                        }
                        onClick={handleLowStock}
                    >
                        Low Stock
                    </button>

                    <button
                        className="refresh-button"
                        onClick={handleShowAll}
                    >
                        Show All
                    </button>

                </div>

            </div>

            {/* Error */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Table */}

            <div className="dashboard-section">

                {loading ? (

                    <div className="loading-state">
                        Loading products...
                    </div>

                ) : products.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No Products Found
                        </h3>

                        <p>
                            No products match your search.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Code
                                    </th>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Supplier
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Min Stock
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {products.map(
                                    (product) => {

                                        const isLowStock =
                                            product.quantity <=
                                            product.minStock;

                                        return (

                                            <tr
                                                key={
                                                    product.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        product.productCode
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            product.productName
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        product.category
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        product.supplier
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        product.quantity
                                                    }
                                                </td>

                                                <td>
                                                    ₹
                                                    {Number(
                                                        product.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        product.minStock
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            isLowStock
                                                                ? "status low"
                                                                : "status available"
                                                        }
                                                    >
                                                        {
                                                            isLowStock
                                                                ? "Low Stock"
                                                                : "Available"
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="action-buttons">

                                                        <Link
                                                            to={`/products/edit/${product.id}`}
                                                            className="edit-button"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Products;