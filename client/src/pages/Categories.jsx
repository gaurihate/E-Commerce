import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory.jsx";
import Layout from "../component/layout/Layout.jsx";
const Categories = () => {
    const categories = useCategory();
    return (
        <Layout title={"All Categories"}>
            <div className="categories-page">
                <div className="container">
                    <div className="row categories-grid">
                        {categories.map((c) => (
                            <div className="col-md-6 col-lg-4" key={c._id}>
                                <div className="category-card">
                                    <Link
                                        to={`/category/${c.slug}`}
                                        className="category-btn"
                                    >
                                        {c.name}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>

    );
};

export default Categories;