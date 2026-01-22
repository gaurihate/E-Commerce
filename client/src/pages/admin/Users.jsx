import React, { useEffect, useState } from "react";
import Layout from "../../component/layout/Layout.jsx";
import AdminMenu from "../../component/layout/AdminMenu.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
    const [users, setUsers] = useState([]);

    // Fetch all users from backend
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get("/api/v1/auth/all-users"); // proxy handles localhost:8080
            setUsers(data);
        } catch (error) {
            console.log("Error fetching users:", error);
            toast.error("Failed to load users");
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <Layout title={"Dashboard - All Users"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>All Users</h1>

                        {users?.length === 0 ? (
                            <h4 className="text-danger">No users found</h4>
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, index) => (
                                        <tr key={u._id}>
                                            <td>{index + 1}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Users;
