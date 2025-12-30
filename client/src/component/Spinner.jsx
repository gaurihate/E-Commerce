import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
const Spinner = () => {
    const [count, setCount] = useState(5)
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state || location.pathname;

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue)
        }, 1000)

        count === 0 && navigate('/login', {
            state: from,
        });

        return () => clearInterval(interval)
    }, [count, navigate, location]);

    return (
        <div className="d-flex flex-column  justify-content-center align-items-center vh-100">
            <h1 className="Text-center">redirecting to you in {count} second</h1>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;
