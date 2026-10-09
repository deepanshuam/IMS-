
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Suppliers from "./pages/Suppliers";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";

function AppLayout() {
    return (
        <div className="app">
            <Sidebar />

            <div className="main-content">
                <Navbar />

                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/add" element={<AddProduct />} />
                        <Route
                            path="/products/edit/:id"
                            element={<EditProduct />}
                        />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route
                            path="/transactions"
                            element={<Transactions />}
                        />
                        <Route path="/reports" element={<Reports />} />

                        <Route
                            path="*"
                            element={<Navigate to="/" replace />}
                        />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<AppLayout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
