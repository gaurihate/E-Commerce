import React from 'react'
import Layout from '../component/layout/Layout.jsx'

const ContactPage = () => {
    return (
        <Layout title="Contact Us">
            <div className="contact-page-container">
                <div className="contact-card">
                    <h1 className="contact-title">Contact Us</h1>
                    <p className="contact-text">
                        Have questions or need assistance? Reach out to us via any of the methods below. We are here to help you 24/7.
                    </p>

                    <div className="contact-details">
                        <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <div>
                                <h3>Phone</h3>
                                <p>+91 1234567890</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <span className="contact-icon">✉️</span>
                            <div>
                                <h3>Email</h3>
                                <p>support@gauriTech.com</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <span className="contact-icon">📍</span>
                            <div>
                                <h3>Address</h3>
                                <p>123, Tech Street,Amravati, India</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <span className="contact-icon">💬</span>
                            <div>
                                <h3>Social</h3>
                                <p>Facebook | Instagram | Twitter</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ContactPage
