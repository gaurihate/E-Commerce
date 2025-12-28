import React from 'react'
import Layout from '../component/layout/Layout.jsx'
import { useAuth } from "../context/auth.jsx"

const HomePage = () => {
    const [auth, setAuth] = useAuth()
    return (
        <Layout >
            <h1>Home page</h1>
            {/* //showing global auth data */}
            <pre>{JSON.stringify(auth, null, 4)}</pre>
        </Layout>
    )
}

export default HomePage
