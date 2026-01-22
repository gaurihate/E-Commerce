import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../component/layout/Layout.jsx";

const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        if (params?.slug) getProductsByCat();
    }, [params?.slug]);

    const getProductsByCat = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="category-product-page">
                <div className="container">
                    <div className="category-header">
                        <h4>Category - {category?.name}</h4>
                        <h6>{products?.length} result found</h6>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="category-product-grid">
                                {products?.map((p) => (
                                    <div className="card category-product-card" key={p._id}>
                                        <img
                                            src={`/api/v1/product/product-photo/${p._id}`}
                                            alt={p.name}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description.substring(0, 30)}...</p>
                                            <p className="price">$ {p.price}</p>
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                            >
                                                More Details
                                            </button>
                                            <button className="btn btn-secondary">Add to Cart</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CategoryProduct;
