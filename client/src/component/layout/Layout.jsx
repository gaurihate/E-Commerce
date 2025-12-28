import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from 'react-toastify';

const Layout = ({ children, title, description, keywords, author }) => {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>

            <Header />

            <main style={{ minHeight: "77.9vh" }}>
                <ToastContainer />
                {children}
            </main>

            <Footer />
        </div>
    );
};




// default props (may be deprecated)
Layout.defaultProps = {
    title: "E-commerce app - Shop Now!!",
    description: "mern stack project",
    keywords: "mern, react ,node,mongodb",
    author: "Gauri@pvt"
};
export default Layout;
