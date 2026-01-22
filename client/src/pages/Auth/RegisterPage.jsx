import React, { useState } from "react";
import Layout from "../../component/layout/Layout.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/AuthStyle.css";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [question, setQuestion] = useState("");
    const navigate = useNavigate();

    // ---------------- FORM SUBMIT ----------------
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page refresh

        try {
            // Use relative URL; proxy in package.json forwards to backend
            const res = await axios.post("/api/v1/auth/register", {
                name,
                email,
                password,
                phone,
                question,
                address,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <Layout title="Register - Ecommerce App">
            <ToastContainer />
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h4 className="title">REGISTER FORM</h4>

                    <div className="mb-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            placeholder="Enter Your Name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter Your Email"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter Password"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-control"
                            placeholder="Enter Phone Number"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-control"
                            placeholder="Enter Address"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="form-control"
                            placeholder="Enter School Name"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Register
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default RegisterPage;
