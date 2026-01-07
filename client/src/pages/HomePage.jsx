import React, { useState, useEffect } from "react";
import Layout from "../component/layout/Layout.jsx";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../component/Prices.jsx";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const API = import.meta.env.VITE_API_URL;

    // get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // get total product count
    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/product/product-count`);
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);

    // get products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${API}/api/v1/product/product-list/${page}`
            );
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    // load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${API}/api/v1/product/product-list/${page}`
            );
            setProducts([...products, ...data.products]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);

    // filter by category
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };

    useEffect(() => {
        if (!checked.length && !radio.length) getAllProducts();
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio]);

    // filtered products
    const filterProduct = async () => {
        try {
            const { data } = await axios.post(
                `${API}/api/v1/product/product-filters`,
                { checked, radio }
            );
            setProducts(data.products);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout title={"All Products - Best Offers"}>
            <div className="container-fluid row mt-3">
                {/* FILTERS */}
                <div className="col-md-2">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((c) => (
                            <Checkbox
                                key={c._id}
                                onChange={(e) =>
                                    handleFilter(e.target.checked, c._id)
                                }
                            >
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>

                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map((p) => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>

                    <button
                        className="btn btn-danger mt-3"
                        onClick={() => window.location.reload()}
                    >
                        RESET FILTERS
                    </button>
                </div>

                {/* PRODUCTS */}
                <div className="col-md-9">
                    <h1 className="text-center">All Products</h1>

                    <div className="d-flex flex-wrap">
                        {products?.map((p) => (
                            <div
                                className="card m-2"
                                style={{ width: "18rem" }}
                                key={p._id}
                            >
                                <img
                                    src={`${API}/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top"
                                    alt={p.name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">
                                        {p.description.substring(0, 30)}...
                                    </p>
                                    <p className="card-text">₹ {p.price}</p>

                                    <button className="btn btn-primary ms-1">
                                        More Details
                                    </button>
                                    <button className="btn btn-secondary ms-1">
                                        ADD TO CART
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {products.length < total && (
                        <button
                            className="btn btn-warning m-3"
                            onClick={() => setPage(page + 1)}
                        >
                            {loading ? "Loading..." : "Load More"}
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
