import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });

    // 🔁 Restore auth after refresh
    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            setAuth(JSON.parse(data));
        }
    }, []);

    // 🔐 Set axios header when token changes
    useEffect(() => {
        if (auth?.token) {
            axios.defaults.headers.common["Authorization"] = auth.token;
        }
    }, [auth.token]);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
