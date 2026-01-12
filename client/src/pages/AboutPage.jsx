import React from "react";
import Layout from "../component/layout/Layout.jsx";

const AboutPage = () => {
    return (
        <Layout title="About Us">
            <div className="page-container auth-page">
                <div className="about-page">
                    <h1 className="about-title">About Us</h1>

                    <p className="about-text">
                        Welcome to GauriTech, your trusted e-commerce platform delivering
                        high-quality products with a seamless shopping experience.
                    </p>

                    <div className="about-highlights">
                        <div className="about-card">
                            <h3>Quality Products</h3>
                            <p>Carefully curated items that meet high standards.</p>
                        </div>

                        <div className="about-card">
                            <h3>Secure Payments</h3>
                            <p>Trusted payment gateways for worry-free shopping.</p>
                        </div>

                        <div className="about-card">
                            <h3>Fast Delivery</h3>
                            <p>Quick and reliable delivery across regions.</p>
                        </div>
                    </div>

                    <ul className="about-list">
                        <li>Easy returns and refunds</li>
                        <li>24/7 customer support</li>
                        <li>Affordable pricing</li>
                    </ul>
                </div>
            </div>
        </Layout>

    );
};

export default AboutPage;
