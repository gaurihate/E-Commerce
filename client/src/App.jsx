//Routes work as a container

import { Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import HomePage from "./pages/HomePage.jsx"
import AboutPage from "./pages/AboutPage.jsx"
import ContactPage from "./pages/ContactPage.jsx";
import PolicyPage from "./pages/PolicyPage.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import DashBoard from "./pages/user/DashBoard.jsx";
import PrivateRoute from "./component/Route/Private.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import AdminRoute from "./component/Route/AdminRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CreateCategory from "./pages/admin/CreateCategory.jsx";
import CreateProduct from "./pages/admin/CreateProduct.jsx";
import Users from "./pages/admin/Users.jsx";
import Orders from "./pages/user/Orders.jsx";
import Profile from "./pages/user/Profile.jsx";
import Products from "./pages/admin/Products.jsx";
import UpdateProduct from "./pages/admin/UpdateProduct.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Categories from "./pages/Categories.jsx";
import CategoryProduct from "./pages/CategoryProduct.jsx";
import Search from "./pages/Search.jsx";
import CartPage from "./pages/CartPage.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx"

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/search" element={<Search />} />
        {/* private nested route to protect dashboad using privateroutr.jsx from backend authroute "user-auth and use middleware requiredSignin" */}
        {/* here first privateroute check if allowed then access the dashboard */}
        <Route path="/dashboard/user" element={<PrivateRoute />}>
          <Route index element={<DashBoard />} />

          {/* other admin pages */}
          <Route path="/dashboard/user/profile" element={<Profile />} />
          <Route path="/dashboard/user/orders" element={<Orders />} />
        </Route>

        <Route path="/dashboard/admin" element={<AdminRoute />}>
          {/* default admin page */}
          <Route index element={<AdminDashboard />} />

          {/* other admin pages */}
          <Route path="/dashboard/admin/create-category" element={<CreateCategory />} />
          <Route path="/dashboard/admin/create-product" element={<CreateProduct />} />
          <Route path="/dashboard/admin/products" element={<Products />} />
          <Route path="/dashboard/admin/product/:slug" element={<UpdateProduct />} />
          <Route path="/dashboard/admin/users" element={<Users />} />
          <Route path="/dashboard/admin/orders" element={<AdminOrders />} />
        </Route>



        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/*if dont geT ABOVE PAGE THEN THE BELOW PAGENOT FOUND PAGE IS ROUTED */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App
