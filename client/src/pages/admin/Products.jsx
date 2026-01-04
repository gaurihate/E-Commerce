import React, { useEffect, useRef, useState } from "react";
import Layout from "../../component/layout/Layout.jsx";
import AdminMenu from "../../component/layout/AdminMenu.jsx";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Products = () => {
    const [products, setProducts] = useState([]);
    const fetched = useRef(false);

    const getAllProducts = async () => {
        const { data } = await axios.get(
            `${API}/api/v1/product/get-product`
        );
        setProducts(data.products);
    };

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        getAllProducts();
    }, []);

    return (
        <Layout>
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu />
                </div>

                <div className="col-md-9">
                    <h2 className="text-center">All Products</h2>

                    <div className="d-flex flex-wrap">
                        {products.map((p) => (
                            <Link
                                key={p._id}
                                to={`/dashboard/admin/product/${p.slug}`}
                                className="text-decoration-none"
                            >
                                <div className="card m-2" style={{ width: "18rem" }}>
                                    <img
                                        src={`${API}/api/v1/product/product-photo/${p._id}`}
                                        className="card-img-top"
                                        alt={p.name}
                                        onError={(e) => (e.target.src = "/no-image.png")}
                                    />
                                    <div className="card-body">
                                        <h5>{p.name}</h5>
                                        <p>{p.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Products;
