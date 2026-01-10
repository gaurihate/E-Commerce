import React, { useEffect, useState } from "react";
import Layout from "../../component/layout/Layout.jsx";
import UserMenu from "../../component/Layout/UserMenu.jsx";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const API = import.meta.env.VITE_API_URL;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [auth] = useAuth();

    const getOrders = async () => {
        try {
            const { data } = await axios.get(
                `${API}/api/v1/auth/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            );
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    return (
        <Layout title="Your Orders">
            <div className="container-fluid p-3 dashboard">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>

                    <div className="col-md-9">
                        <h1 className="text-center">All Orders</h1>

                        {orders.length === 0 && (
                            <p className="text-center">No orders found</p>
                        )}

                        {orders.map((o) => (
                            <div className="border shadow mb-4" key={o._id}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Buyer</th>
                                            <th>Date</th>
                                            <th>Payment</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{o.status}</td>
                                            <td>{o.buyer?.name}</td>
                                            <td>{moment(o.createdAt).fromNow()}</td>
                                            <td>{o.payment?.success ? "Success" : "Failed"}</td>
                                            <td>{o.products.length}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="container">
                                    {o.products.map((p) => (
                                        <div className="row mb-2 p-3 card flex-row" key={p._id}>
                                            <div className="col-md-4">
                                                <img
                                                    src={`${API}/api/v1/product/product-photo/${p._id}`}
                                                    className="card-img-top"
                                                    alt={p.name}
                                                    height="100"
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <p>{p.name}</p>
                                                <p>{p.description?.substring(0, 30)}</p>
                                                <p>Price: {p.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
