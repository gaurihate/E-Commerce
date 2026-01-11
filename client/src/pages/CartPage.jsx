import React, { useEffect, useState, useRef } from "react";
import Layout from "../component/layout/Layout.jsx";
import dropin from "braintree-web-drop-in";
import { useCart } from "../context/cart.jsx";
import { useAuth } from "../context/auth.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorBoundary from "../component/ErrorBoundary.jsx";

const CartPage = () => {
    const [auth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(false);

    const dropinContainerRef = useRef(null);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    // ---------------- TOTAL PRICE ----------------
    const totalPrice = () => {
        try {
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        } catch (err) {
            console.error(err);
            return "$0.00";
        }
    };

    // ---------------- REMOVE CART ITEM ----------------
    const removeCartItem = (pid) => {
        const newCart = cart.filter((item) => item._id !== pid);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // ---------------- GET BRAINTREE TOKEN ----------------
    const getToken = async () => {
        try {
            const { data } = await axios.get(
                `${API}/api/v1/product/braintree/token`
            );
            setClientToken(data.clientToken);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getToken();
    }, [auth?.token]);

    // ---------------- INIT DROP-IN (IMPORTANT PART) ----------------
    useEffect(() => {
        if (!clientToken || cart.length === 0 || instance) return;

        dropin.create(
            {
                authorization: clientToken,
                container: dropinContainerRef.current,
                paypal: {
                    flow: "vault",
                },
            },
            (error, dropinInstance) => {
                if (error) {
                    console.error("Drop-in error:", error);
                    toast.error("Payment UI failed to load");
                    return;
                }
                setInstance(dropinInstance);
            }
        );

        // cleanup
        return () => {
            if (instance) {
                instance.teardown();
            }
        };
    }, [clientToken]);

    // ---------------- HANDLE PAYMENT ----------------
    const handlePayment = async () => {
        if (!instance) return toast.error("Payment not ready");
        if (!auth?.user?.address)
            return toast.error("Please update your address");

        try {
            setLoading(true);

            const { nonce } = await instance.requestPaymentMethod();

            await axios.post(`${API}/api/v1/product/braintree/payment`, {
                nonce,
                cart,
            });

            setLoading(false);
            setCart([]);
            localStorage.removeItem("cart");
            toast.success("Payment successful");
            navigate("/dashboard/user/orders");
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error("Payment failed");
        }
    };

    // ---------------- JSX ----------------
    return (
        <ErrorBoundary>
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center bg-light p-2">
                            <h1>
                                Hello {auth?.token ? auth.user?.name : "Guest"}
                            </h1>
                            <h4>
                                {cart.length > 0
                                    ? `You have ${cart.length} items in your cart`
                                    : "Your cart is empty"}
                            </h4>
                        </div>
                    </div>

                    <div className="row mt-3">
                        {/* CART ITEMS */}
                        <div className="col-md-8">
                            {cart.map((p) => (
                                <div key={p._id} className="card mb-2 p-3 flex-row">
                                    <img
                                        src={`${API}/api/v1/product/product-photo/${p._id}`}
                                        alt={p.name}
                                        width="100"
                                        height="100"
                                    />
                                    <div className="ms-3">
                                        <p>{p.name}</p>
                                        <p>{p.description?.substring(0, 30)}</p>
                                        <p>${p.price}</p>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => removeCartItem(p._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PAYMENT */}
                        <div className="col-md-4">
                            <h2>Cart Summary</h2>
                            <hr />
                            <h4>Total: {totalPrice()}</h4>

                            {auth?.user?.address ? (
                                <>
                                    <p><strong>Address:</strong></p>
                                    <p>{auth.user.address}</p>
                                </>
                            ) : (
                                <button
                                    className="btn btn-warning mb-3"
                                    onClick={() =>
                                        auth?.token
                                            ? navigate("/dashboard/user/profile")
                                            : navigate("/login", { state: "/cart" })
                                    }
                                >
                                    Login / Add Address
                                </button>
                            )}

                            {clientToken && cart.length > 0 && (
                                <>
                                    <div ref={dropinContainerRef}></div>
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={handlePayment}
                                        disabled={loading || !instance}
                                    >
                                        {loading ? "Processing..." : "Make Payment"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </ErrorBoundary>
    );
};

export default CartPage;
