
import { useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Suppliers from "./pages/Suppliers";
import Transactions from "./pages/Transactions";
import Login from "./pages/Login";
import Reports from "./pages/Reports";

function AppLayout() {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("imsUser")) || null;
        } catch {
            return null;
        }
    });

    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    const handleLogin = (userData) => {
        localStorage.setItem("imsUser", JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem("imsUser");
        setUser(null);
    };

    if (isLoginPage) {
        return user
            ? <Navigate to="/" replace />
            : <Login onLogin={handleLogin} />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app">
            <Sidebar />

            <div className="main-content">
                <Navbar />

                <div className="session-bar">
                    <span>
                        Signed in as <strong>{user.username}</strong>
                    </span>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

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
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/*" element={<AppLayout />} />
            </Routes>
        </BrowserRouter>
    );
}

function LoginRoute() {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("imsUser")) || null;
        } catch {
            return null;
        }
    });

    const handleLogin = (userData) => {
        localStorage.setItem("imsUser", JSON.stringify(userData));
        setUser(userData);
    };

    return user
        ? <Navigate to="/" replace />
        : <Login onLogin={handleLogin} />;
}

export default App;
