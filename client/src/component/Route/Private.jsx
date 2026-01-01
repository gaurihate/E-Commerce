import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../Spinner.jsx";

const Private = () => {
    const [auth, , loading] = useAuth();
    const [allowed, setAllowed] = useState(null); // 🔒 locked decision

    useEffect(() => {
        if (!auth?.token || allowed !== null) return;

        const checkAuth = async () => {
            try {
                await axios.get("/api/v1/auth/user-auth");
                setAllowed(true); // 🔒 LOCK
            } catch {
                setAllowed(false);
            }
        };

        checkAuth();
    }, [auth?.token, allowed]);

    if (loading || allowed === null) return <Spinner />;

    return allowed ? <Outlet /> : <Navigate to="/login" replace />;
};
export default Private;