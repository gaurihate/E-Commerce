import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Layout from "../../component/layout/Layout.jsx";
import UserMenu from "../../component/layout/UserMenu.jsx";
import { useAuth } from "../../context/auth.jsx";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [auth] = useAuth();

    // ---------------- GET USER ORDERS ----------------
    const getOrders = async () => {
        try {
            // Relative URL; proxy will forward to backend
            const { data } = await axios.get("/api/v1/auth/orders");
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    return (
        <Layout title={"Your Orders"}>
            <div className="row dashboard">
                <div className="col-md-3">
                    <UserMenu />
                </div>

                <div className="col-md-9">
                    <h2>Your Orders</h2>

                    {orders?.length === 0 && (
                        <p>No orders found</p>
                    )}

                    {orders.map((o) => (
                        <div className="border shadow mb-4 p-3" key={o._id}>
                            <p>
                                <b>Status:</b> {o.status} <br />
                                <b>Ordered:</b> {moment(o.createdAt).fromNow()} <br />
                                <b>Payment:</b> {o.payment?.success ? "Success" : "Failed"}
                            </p>

                            {o.products.map((item) => (
                                <div
                                    className="row mb-2 card flex-row align-items-center"
                                    key={item.product._id}
                                >
                                    <div className="col-md-3">
                                        <img
                                            src={`/api/v1/product/product-photo/${item.product._id}`}
                                            alt={item.product.name}
                                            className="img-fluid"
                                            style={{ maxHeight: "100px" }}
                                            onError={(e) => (e.target.style.display = "none")}
                                        />
                                    </div>

                                    <div className="col-md-9">
                                        <p><b>{item.product.name}</b></p>
                                        <p>{item.product.description?.substring(0, 40)}...</p>
                                        <p>Price: ₹{item.product.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
