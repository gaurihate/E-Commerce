import React from 'react'
import { NavLink, Link } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"
import { useAuth } from '../../context/auth.jsx'

const Header = () => {
    const [auth, setAuth] = useAuth();

    //clear local Storage 
    const handleLogOut = () => {
        setAuth({
            ...auth, user: null, token: ''
        })
        localStorage.removeItem("auth")
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link className="navbar-brand" > <FaShoppingCart />  ECOMMERCE APP</Link>

                        {/* ms -margin start */}
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink
                                    to="/"
                                    className="nav-link "
                                >
                                    Home
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to="/category"
                                    className="nav-link"
                                >
                                    Category
                                </NavLink>
                            </li>

                            {/* //ternary operator used */}
                            {

                                !auth.user ? (
                                    //if login amd register
                                    <>
                                        <li className="nav-item">
                                            <NavLink
                                                to="/register"
                                                className="nav-link"
                                            >
                                                Register
                                            </NavLink>
                                        </li>

                                        <li className="nav-item">
                                            <NavLink
                                                to="/login"
                                                className="nav-link"
                                            >
                                                Login
                                            </NavLink>
                                        </li>

                                    </>
                                ) : (
                                    //else log out
                                    <>
                                        <li className="nav-item dropdown">

                                            {/* dropdown menu name */}
                                            <NavLink
                                                to="#"
                                                className="nav-link dropdown-toggle"
                                                role="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {/* show name of user */}
                                                {auth?.user?.name}
                                            </NavLink>

                                            {/* actual menu element */}
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <NavLink
                                                        to={`/dashboard/${Number(auth?.user?.role) === 1 ? 'admin' : 'user'}`}
                                                        className="dropdown-item"
                                                    >
                                                        Dashboard
                                                    </NavLink>

                                                </li>
                                                <li>
                                                    <NavLink
                                                        onClick={handleLogOut}
                                                        to="/login"
                                                        className="dropdown-item"
                                                    >
                                                        Logout
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </li>
                                    </>
                                )

                            }

                            <li className="nav-item">
                                <NavLink
                                    to="/cart"
                                    className="nav-link"
                                >
                                    Cart (0)
                                </NavLink>
                            </li>

                        </ul>

                    </div>
                </div>
            </nav>

        </>
    )
}

export default Header


/*



WHO DOES WHAT? (VERY IMPORTANT)
Part	Responsibility
NavLink	Change URL + detect active
BrowserRouter	Watch URL
Routes	Match URL
Route	Provide component
React	Render component
CSS	Style active link



Click Login
↓
URL becomes /login
↓
BrowserRouter notices
↓
Routes match /login
↓
<Login /> renders
↓
NavLink sees URL match
↓
.active class added
↓
CSS underline appears





1️⃣ Click on NavLink
↓
2️⃣ NavLink reads: to="/login"
↓
3️⃣ React Router updates browser URL
↓
4️⃣ URL becomes: http://localhost:5173/login
↓
5️⃣ Page does NOT reload
↓
6️⃣ React Router checks Routes
↓
7️⃣ Finds matching route: /login
↓
8️⃣ Renders Login component
↓
9️⃣ NavLink becomes ACTIVE





Login
 ↓
Save auth (Context (ram ) + localStorage(hardisk))
 ↓
Navigate Home
 ↓
Refresh
 ↓
Restore from localStorage (context API (useeffect {from local storage}))
 ↓
User stays logged in
 ↓
Logout(local storage clearS)
 ↓
Clear Context + localStorage
 ↓
Redirect to Login


 */




