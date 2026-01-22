import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../component/Prices.jsx";
import Layout from "../component/layout/Layout.jsx";
import { useCart } from "../context/cart.jsx";
import toast from "react-hot-toast";

const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // ---------------- GET CATEGORIES ----------------
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) setCategories(data.category);
        } catch (error) {
            console.log(error);
        }
    };

    // ---------------- GET TOTAL COUNT ----------------
    const getTotal = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/product-count");
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    // ---------------- GET PRODUCTS (PAGE 1) ----------------
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/v1/product/product-list/1");
            setProducts(data?.products || []);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    // ---------------- LOAD MORE PRODUCTS ----------------
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setProducts((prev) => [...prev, ...data.products]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    // ---------------- INITIAL LOAD ----------------
    useEffect(() => {
        getAllCategory();
        getTotal();
        getAllProducts();
    }, []);

    // ---------------- LOAD MORE EFFECT ----------------
    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);

    // ---------------- CATEGORY FILTER ----------------
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) all.push(id);
        else all = all.filter((c) => c !== id);
        setChecked(all);
    };

    // ---------------- FILTER PRODUCTS ----------------
    const filterProduct = async () => {
        try {
            const { data } = await axios.post("/api/v1/product/product-filters", { checked, radio });
            setProducts(data?.products || []);
        } catch (error) {
            console.log(error);
        }
    };

    // ---------------- FILTER EFFECT ----------------
    useEffect(() => {
        if (!checked.length && !radio.length) getAllProducts();
        else filterProduct();
    }, [checked, radio]);

    return (
        <Layout title="All Products">
            <div className="container-fluid row mt-3">
                {/* FILTER SECTION */}
                <div className="col-md-2">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((c) => (
                            <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>

                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map((p) => (
                                <Radio key={p._id} value={p.array}>
                                    {p.name}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </div>

                    <button className="btn btn-danger mt-3" onClick={() => window.location.reload()}>
                        RESET FILTERS
                    </button>
                </div>

                {/* PRODUCT SECTION */}
                <div className="col-md-9">
                    <h1 className="text-center">All Products</h1>

                    <div className="d-flex flex-wrap">
                        {products?.map((p) => (
                            <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}...</p>
                                    <p className="card-text">₹ {p.price}</p>

                                    <button className="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>
                                        More Details
                                    </button>

                                    <button
                                        className="btn btn-secondary ms-1"
                                        onClick={() => {
                                            const alreadyInCart = cart.find((item) => item._id === p._id);
                                            if (alreadyInCart) return toast.error("Item already in cart");

                                            const updatedCart = [...cart, p];
                                            setCart(updatedCart);
                                            localStorage.setItem("cart", JSON.stringify(updatedCart));
                                            toast.success("Item added to cart");
                                        }}
                                    >
                                        ADD TO CART
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {products.length < total && (
                        <button className="btn btn-warning m-3" onClick={() => setPage(page + 1)} disabled={loading}>
                            {loading ? "Loading..." : "Load More"}
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
