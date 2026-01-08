import React, { useEffect, useState } from "react";
import Layout from "../component/layout/Layout.jsx";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    const API = import.meta.env.VITE_API_URL;

    const getProduct = async () => {
        const { data } = await axios.get(
            `${API}/api/v1/product/get-product/${params.slug}`
        );
        setProduct(data.product);
        getSimilarProduct(data.product._id, data.product.category._id);
    };

    const getSimilarProduct = async (pid, cid) => {
        const { data } = await axios.get(
            `${API}/api/v1/product/related-product/${pid}/${cid}`
        );
        setRelatedProducts(data.products);
    };

    useEffect(() => {
        if (params.slug) getProduct();
    }, [params.slug]);

    return (
        <Layout>
            <div className="container row">
                <div className="col-md-6">
                    <img
                        src={`${API}/api/v1/product/product-photo/${product._id}`}
                        className="img-fluid"
                        alt={product.name}
                    />
                </div>
                <div className="col-md-6">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>₹ {product.price}</p>
                    <p>{product?.category?.name}</p>
                </div>
            </div>

            <hr />

            <div className="container">
                <h4>Similar Products</h4>
                <div className="d-flex flex-wrap">
                    {relatedProducts.map((p) => (
                        <div key={p._id} className="card m-2" style={{ width: "18rem" }}>
                            <img
                                src={`${API}/api/v1/product/product-photo/${p._id}`}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5>{p.name}</h5>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/product/${p.slug}`)}
                                >
                                    More Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
