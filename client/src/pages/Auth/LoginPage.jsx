import React, { useState } from "react";
import Layout from "../../component/layout/Layout";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../../style/AuthStyle.css";
import { useAuth } from "../../context/auth.jsx";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const API = import.meta.env.VITE_API_URL;
    const [auth, setAuth] = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${API}/api/v1/auth/login`,
                { email, password }
            );

            if (res.data.success) {
                setAuth({
                    user: res.data.user,
                    token: res.data.token,
                });

                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        user: res.data.user,
                        token: res.data.token,
                    })
                );

                // ✅ FIX: attach token to axios immediately
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${res.data.token}`;

                navigate(location.state || "/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <Layout title="Login - Ecommerce App">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h4 className="title">LOGIN HERE</h4>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Email"
                        required
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter Password"
                        required
                    />

                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>

                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default LoginPage;
