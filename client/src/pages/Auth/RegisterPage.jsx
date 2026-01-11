import React, { useState } from "react";
import Layout from "../../component/layout/Layout.jsx";
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../../style/AuthStyle.css";



const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [question, setQuestion] = useState("");
    const navigate = useNavigate()
    const API = import.meta.env.VITE_API_URL;
    //form function 
    const handleSubmit = async (e) => {
        e.preventDefault()                                  //stop browser to referersing page from submit
        console.log(name, email, password, phone, address);
        toast.success("register successfully");

        try {
            const res = await axios.post(`${API}/api/v1/auth/register`, { name, email, password, phone, question, address }); //send data to backend usinf cors and .env
            // const res = await axios.post("/api/v1/auth/register", { name, email, password, phone, address }); ====> send data using proxy no need to install cors pakage

            if (res.data.success) {    //data came from backend at res.data
                toast.success(res.data.message) //show notification
                navigate('/login');
            }
            else {
                toast.error(res.data.message)
            }

        }
        catch (error) {
            console.log(error)
            toast.error('something went wrong')
        }
    }


    return (
        <Layout title="Register - Ecommerce App">
            <div className="form-container">

                <form onSubmit={handleSubmit} >
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




// React (Frontend)
//    ↓
// Axios (sends request)
//    ↓
// Backend API (Express / Node)
//    ↓
// Database


/*

Step-by-step flow:

1️⃣ User clicks Register
2️⃣ Form onSubmit runs
3️⃣ Axios creates an HTTP request
4️⃣ Browser sends request
5️⃣ Backend receives request
6️⃣ Backend sends response
7️⃣ Axios receives response
8️⃣ React updates UI
 */




/*
    Step-by-step typing flow:

1️⃣ User types "g"
2️⃣ onChange event fires
3️⃣ React sends event as e
4️⃣ e.target.value = "g"
5️⃣ setEmail("g")
6️⃣ React updates state
7️⃣ Component re-renders
8️⃣ Input shows "g"

This happens for every key pres
*/