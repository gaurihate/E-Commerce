import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";
import { useCart } from "../../context/cart.jsx";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput.jsx";
import useCategory from "../../hooks/useCategory.jsx";
import { Badge } from "antd";

const Header = () => {
    const [auth, setAuth] = useAuth();
    const [cart] = useCart();
    const categories = useCategory();

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: "",
        });
        localStorage.removeItem("auth");
        toast.success("Logout Successfully");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo01"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <Link to="/" className="navbar-brand">
                        🛒 Ecommerce App
                    </Link>

                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {/* SEARCH */}
                        <li className="nav-item">
                            <SearchInput />
                        </li>

                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">
                                Home
                            </NavLink>
                        </li>

                        {/* CATEGORIES */}
                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle"
                                to="/categories"
                                data-bs-toggle="dropdown"
                            >
                                Categories
                            </Link>

                            <ul className="dropdown-menu">
                                <li key="all">
                                    <Link className="dropdown-item" to="/categories">
                                        All Categories
                                    </Link>
                                </li>

                                {categories?.map((c) => (
                                    <li key={c._id}>
                                        <Link
                                            className="dropdown-item"
                                            to={`/category/${c.slug}`}
                                        >
                                            {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        {!auth?.user ? (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/register" className="nav-link">
                                        Register
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link">
                                        Login
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item dropdown">
                                <NavLink
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                >
                                    {auth?.user?.name}
                                </NavLink>

                                <ul className="dropdown-menu">
                                    <li key="dashboard">
                                        <NavLink
                                            to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"
                                                }`}
                                            className="dropdown-item"
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    <li key="logout">
                                        <NavLink
                                            onClick={handleLogout}
                                            to="/login"
                                            className="dropdown-item"
                                        >
                                            Logout
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        )}

                        {/* CART */}
                        <li className="nav-item">
                            <Badge count={cart?.length} showZero>
                                <NavLink to="/cart" className="nav-link">
                                    Cart
                                </NavLink>
                            </Badge>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
