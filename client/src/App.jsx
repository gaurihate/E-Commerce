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
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/*if dont geT ABOVE PAGE THEN THE BELOW PAGENOT FOUND PAGE IS ROUTED */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App
