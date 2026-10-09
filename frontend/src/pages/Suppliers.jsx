
import { useEffect, useState } from "react";
import {
    getSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier
} from "../api/supplierApi";

const emptyForm = {
    supplierName: "",
    phone: "",
    email: "",
    address: ""
};

function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadSuppliers = async () => {
        try {
            const response = await getSuppliers();
            setSuppliers(response.data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load suppliers. Check the backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (
            !formData.supplierName.trim() ||
            !formData.phone.trim() ||
            !formData.email.trim()
        ) {
            setError("Supplier name, phone and email are required.");
            return;
        }

        try {
            setSaving(true);

            if (editingId) {
                await updateSupplier(editingId, formData);
            } else {
                await addSupplier(formData);
            }

            setFormData(emptyForm);
            setEditingId(null);
            await loadSuppliers();
        } catch (err) {
            console.error(err);
            setError("Unable to save supplier. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (supplier) => {
        setEditingId(supplier.id);
        setFormData({
            supplierName: supplier.supplierName || "",
            phone: supplier.phone || "",
            email: supplier.email || "",
            address: supplier.address || ""
        });
        setError("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this supplier?")) {
            return;
        }

        try {
            await deleteSupplier(id);
            await loadSuppliers();

            if (editingId === id) {
                handleCancel();
            }
        } catch (err) {
            console.error(err);
            setError("Unable to delete supplier.");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setError("");
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Supplier Management</h2>
                <p>Add and manage your inventory suppliers.</p>
            </div>

            <div className="form-card">
                <h3>{editingId ? "Edit Supplier" : "Add New Supplier"}</h3>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Supplier Name *</label>
                            <input
                                name="supplierName"
                                value={formData.supplierName}
                                onChange={handleChange}
                                placeholder="Enter supplier name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone *</label>
                            <input
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        {editingId && (
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Supplier"
                                    : "Add Supplier"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-card">
                <div className="table-header">
                    <h3>All Suppliers</h3>
                    <span>{suppliers.length} suppliers</span>
                </div>

                {loading ? (
                    <p className="loading-state">Loading suppliers...</p>
                ) : suppliers.length === 0 ? (
                    <div className="empty-state">
                        No suppliers found. Add your first supplier above.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Supplier Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {suppliers.map((supplier) => (
                                    <tr key={supplier.id}>
                                        <td>{supplier.supplierName}</td>
                                        <td>{supplier.phone}</td>
                                        <td>{supplier.email}</td>
                                        <td>{supplier.address || "—"}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(supplier)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(supplier.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
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

export default Suppliers;
