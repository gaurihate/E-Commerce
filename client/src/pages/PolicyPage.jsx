import React from 'react'
import Layout from '../component/layout/Layout.jsx'

const PolicyPage = () => {
    return (
        <Layout title="Policy">
            <div className="policy-page-container">
                <div className="policy-card">
                    <h1 className="policy-title">Our Policies</h1>

                    <p className="policy-text">
                        At ShopEase, we value transparency and trust. Please read our policies below to ensure a smooth shopping experience.
                    </p>

                    <div className="policy-section">
                        <h3>Return Policy</h3>
                        <p>We accept returns within 14 days of delivery. Products should be unused and in original packaging.</p>
                    </div>

                    <div className="policy-section">
                        <h3>Payment Policy</h3>
                        <p>All payments are secure through trusted gateways. We support multiple payment methods for your convenience.</p>
                    </div>

                    <div className="policy-section">
                        <h3>Shipping Policy</h3>
                        <p>We deliver across regions with reliable shipping partners. Tracking information will be provided for all orders.</p>
                    </div>

                    <div className="policy-section">
                        <h3>Privacy Policy</h3>
                        <p>Your data is safe with us. We do not share your personal information with third parties.</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PolicyPage
