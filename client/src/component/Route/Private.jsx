import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom"
import axios from "axios";
import Spinner from "../Spinner.jsx";

export default function PrivateRoute() {
    const [ok, setOk] = useState(false)
    const [auth, setAuth] = useAuth()

    useEffect(() => {
        const authCheck = async () => {
            const res = await axios.get('/api/v1/auth/user-auth'
                // {
                //     //instaed of write this we can globally set in context  API
                //     // header: {
                //     //     "Authorization": auth?.token
                //     // }
                // }// it is written in  context api
            )

            if (res.data.ok) {
                setOk(true)    //compoent rerender as state change
            }
            else {
                setOk(false)
            }
        }

        if (auth?.token) authCheck()
    }, [auth?.token])

    return ok ? <Outlet /> : <Spinner />;  // if ok true show protected page otherwise show the spinner
} 