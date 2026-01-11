import React from "react";
import Layout from "../component/layout/Layout.jsx";
import { useNavigate } from "react-router-dom";


const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="pagenotfound-container">
                <div className="pagenotfound-content">
                    <h1>404</h1>
                    <h2>Oops! Page Not Found</h2>
                    <p>
                        The page you're looking for doesn’t exist or has been moved.
                        Explore our products and find something amazing!
                    </p>
                    <button onClick={() => navigate("/")} className="home-btn">
                        Go Back Home
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default PageNotFound;
