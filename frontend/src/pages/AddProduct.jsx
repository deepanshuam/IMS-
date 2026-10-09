import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api/productApi";

function AddProduct() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        productCode: "",
        productName: "",
        category: "",
        supplier: "",
        quantity: "",
        price: "",
        minStock: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.productCode ||
            !formData.productName ||
            !formData.category ||
            !formData.supplier
        ) {
            setError("Please fill all required fields.");
            return;
        }

        try {

            setLoading(true);
            setError("");

            const product = {
                productCode: formData.productCode,
                productName: formData.productName,
                category: formData.category,
                supplier: formData.supplier,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
                minStock: Number(formData.minStock)
            };

            await addProduct(product);

            navigate("/products");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to add product. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="page">

            <div className="page-header">

                <h2>Add Product</h2>

                <p>
                    Add a new product to your inventory
                </p>

            </div>

            <div className="form-card">

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>
                                Product Code *
                            </label>

                            <input
                                type="text"
                                name="productCode"
                                value={formData.productCode}
                                onChange={handleChange}
                                placeholder="Example: P002"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Category *
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Example: Electronics"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Supplier *
                            </label>

                            <input
                                type="text"
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleChange}
                                placeholder="Supplier name"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                min="0"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Minimum Stock
                            </label>

                            <input
                                type="number"
                                name="minStock"
                                min="0"
                                value={formData.minStock}
                                onChange={handleChange}
                                placeholder="5"
                            />
                        </div>

                    </div>

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "Save Product"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddProduct;