//Routes work as a container

import { Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import HomePage from "./pages/HomePage.jsx"
import AboutPage from "./pages/AboutPage.jsx"
import ContactPage from "./pages/ContactPage.jsx";
import PolicyPage from "./pages/PolicyPage.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import LoginPage from "./pages/Auth/loginPage.jsx";
import DashBoard from "./pages/user/DashBoard.jsx";
import PrivateRoute from "./component/Route/Private.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* private nested route to protect dashboad using privateroutr.jsx from backend authroute "user-auth and use middleware requiredSignin" */}
        {/* here first privateroute check if allowed then access the dashboard */}
        <Route path="/dashboard" element={<PrivateRoute />}>

          <Route path="" element={<DashBoard />} />

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
