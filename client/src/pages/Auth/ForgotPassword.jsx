import React, { useState } from "react";
import Layout from "../../component/layout/Layout";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/AuthStyle.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [question, setQuestion] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${API}/api/v1/auth/forgot-password`,
                { email, question, newPassword }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <Layout title="Forgot Password">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h4 className="title">RESET PASSWORD</h4>

                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your security answer"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn btn-primary">
                        Reset Password
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
