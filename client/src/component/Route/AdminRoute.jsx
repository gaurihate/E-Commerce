import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../Spinner.jsx";

const AdminRoute = () => {
    const [auth, , loading] = useAuth();
    const [allowed, setAllowed] = useState(null);

    // 1️⃣ Client-side role check (instant redirect)
    useEffect(() => {
        if (!auth.user) return;
        if (auth.user.role !== 1) setAllowed(false);
    }, [auth.user]);

    // 2️⃣ Backend verification
    useEffect(() => {
        if (!auth?.token || allowed === false) return;

        const checkAdmin = async () => {
            try {
                await axios.get("/api/v1/auth/admin-auth", {
                    headers: { Authorization: `Bearer ${auth.token}` },
                    params: { t: Date.now() }, // cache buster
                });
                setAllowed(true);
            } catch {
                setAllowed(false);
            }
        };

        checkAdmin();
    }, [auth?.token, allowed]);

    if (loading || allowed === null) return <Spinner />;

    if (!allowed) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default AdminRoute;
