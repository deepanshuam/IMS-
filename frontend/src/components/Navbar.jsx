function Navbar() {
    return (
        <header className="navbar">
            <div>
                <h1>Inventory Management System</h1>
                <p>Manage your inventory efficiently</p>
            </div>

            <div className="navbar-user">
                <div className="user-avatar">
                    A
                </div>

                <div>
                    <strong>Admin</strong>
                    <span>Administrator</span>
                </div>
            </div>
        </header>
    );
}

export default Navbar;