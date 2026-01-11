import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Layout from "../../component/layout/Layout.jsx";
import AdminMenu from "../../component/layout/AdminMenu.jsx";
import { useAuth } from "../../context/auth.jsx";
import { Select } from "antd";

const { Option } = Select;

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [auth] = useAuth();

    const API = import.meta.env.VITE_API_URL;

    const orderStatus = [
        "Not Process",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancel",

    ];

    // ==============================
    // GET ALL ORDERS
    // ==============================
    const getOrders = async () => {
        try {
            const { data } = await axios.get(
                `${API}/api/v1/auth/all-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    }

                }
            );
            setOrders(data);
        } catch (error) {
            console.log("Error fetching orders:", error);
        }
    };

    // ==============================
    // UPDATE ORDER STATUS
    // ==============================
    const handleStatusChange = async (orderId, value) => {
        try {
            await axios.put(
                `${API}/api/v1/auth/order-status/${orderId}`,
                { status: value },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    }

                }
            );
            getOrders();
        } catch (error) {
            console.log("Status update error:", error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    return (
        <Layout title="All Orders">
            <div className="container-fluid">
                <div className="row dashboard">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>

                    <div className="col-md-9">
                        <h2 className="text-center mb-4">All Orders</h2>

                        {orders?.length === 0 && (
                            <h4 className="text-center text-danger">
                                No orders found
                            </h4>
                        )}

                        {orders?.map((order, index) => (
                            <div
                                className="border shadow mb-4 p-3"
                                key={order._id}
                            >
                                {/* ORDER INFO */}
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Status</th>
                                            <th>Buyer</th>
                                            <th>Date</th>
                                            <th>Payment</th>
                                            <th>Total Items</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{index + 1}</td>

                                            <td>
                                                <Select
                                                    bordered={false}
                                                    defaultValue={order.status}
                                                    onChange={(value) =>
                                                        handleStatusChange(order._id, value)
                                                    }
                                                >
                                                    {orderStatus.map((s) => (
                                                        <Option key={s} value={s}>
                                                            {s}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </td>

                                            <td>{order?.buyer?.name}</td>

                                            <td>
                                                {moment(order?.createdAt).fromNow()}
                                            </td>

                                            <td>
                                                {order?.payment?.success
                                                    ? "Success"
                                                    : "Failed"}
                                            </td>

                                            <td>{order?.products?.length}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* PRODUCT DETAILS */}
                                <div className="container">
                                    {order?.products?.map((item) => (
                                        <div
                                            className="row card flex-row mb-2 p-3"
                                            key={item.product?._id}
                                        >
                                            <div className="col-md-4">
                                                <img
                                                    src={`${API}/api/v1/product/product-photo/${item.product?._id}`}
                                                    alt={item.product?.name}
                                                    className="img-fluid"
                                                    style={{
                                                        maxHeight: "130px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-8">
                                                <h6>{item.product?.name}</h6>
                                                <p>
                                                    {item.product?.description?.substring(
                                                        0,
                                                        50
                                                    )}
                                                </p>
                                                <p>
                                                    Price: ₹{item.product?.price}
                                                </p>
                                                <p>
                                                    Quantity: {item.quantity}
                                                </p>
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

export default AdminOrders;
