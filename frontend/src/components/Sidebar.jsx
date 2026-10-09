import { NavLink } from "react-router-dom";

function Sidebar() {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/"
        },
        {
            name: "Products",
            path: "/products"
        },
        {
            name: "Suppliers",
            path: "/suppliers"
        },
        {
            name: "Transactions",
            path: "/transactions"
        },
        { name: "Reports", path: "/reports" }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>IMS</h2>
                <p>Inventory System</p>
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;