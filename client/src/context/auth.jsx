import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });

    const [loading, setLoading] = useState(true);

    // ✅ Load auth from localStorage on app start
    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parsed = JSON.parse(data);
            setAuth(parsed);
        }
        setLoading(false);
    }, []);

    // ✅ KEEP AXIOS HEADER IN SYNC WITH AUTH STATE
    useEffect(() => {
        if (auth?.token) {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${auth.token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [auth?.token]);

    return (
        <AuthContext.Provider value={[auth, setAuth, loading]}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
