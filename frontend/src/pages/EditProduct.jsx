import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProduct,
    updateProduct
} from "../api/productApi";

function EditProduct() {

    const { id } = useParams();
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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {

        try {

            const response = await getProduct(id);

            const product = response.data;

            setFormData({
                productCode: product.productCode || "",
                productName: product.productName || "",
                category: product.category || "",
                supplier: product.supplier || "",
                quantity: product.quantity ?? "",
                price: product.price ?? "",
                minStock: product.minStock ?? ""
            });

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load product."
            );

        } finally {

            setLoading(false);

        }
    };

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
            setError(
                "Please fill all required fields."
            );

            return;
        }

        try {

            setSaving(true);
            setError("");

            const updatedProduct = {

                productCode:
                    formData.productCode,

                productName:
                    formData.productName,

                category:
                    formData.category,

                supplier:
                    formData.supplier,

                quantity:
                    Number(formData.quantity),

                price:
                    Number(formData.price),

                minStock:
                    Number(formData.minStock)
            };

            await updateProduct(
                id,
                updatedProduct
            );

            navigate("/products");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to update product."
            );

        } finally {

            setSaving(false);

        }
    };

    if (loading) {

        return (
            <div className="page">
                <p>Loading product...</p>
            </div>
        );
    }

    return (

        <div className="page">

            <div className="page-header">

                <h2>Edit Product</h2>

                <p>
                    Update product information
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
                                value={
                                    formData.productCode
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="productName"
                                value={
                                    formData.productName
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Category *
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Supplier *
                            </label>

                            <input
                                type="text"
                                name="supplier"
                                value={
                                    formData.supplier
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Quantity
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="quantity"
                                value={
                                    formData.quantity
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="price"
                                value={
                                    formData.price
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Minimum Stock
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="minStock"
                                value={
                                    formData.minStock
                                }
                                onChange={
                                    handleChange
                                }
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
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update Product"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditProduct;