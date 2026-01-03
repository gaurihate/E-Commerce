import React, { useEffect, useState } from "react";
import Layout from "../../component/layout/Layout.jsx";
import AdminMenu from "../../component/layout/AdminMenu.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import CategoryForm from "../../component/Form/CategoryForm.jsx";
import { Modal } from "antd"; // form popup
import { useAuth } from "../../context/auth.jsx";

const CreateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    const [auth, setAuth] = useAuth(); // get logged-in user & token
    const API = import.meta.env.VITE_API_URL; // your base API URL

    // ---------------- HANDLE CREATE CATEGORY ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${API}/api/v1/category/create-category`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`, // attach token
                    },
                }
            );

            if (data?.success) {
                toast.success(`${name} is created`);
                setName("");
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("CREATE CATEGORY ERROR 👉", error);
            toast.error(
                error.response?.data?.message || "Something went wrong in creating category"
            );
        }
    };

    // ---------------- GET ALL CATEGORIES ----------------
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${API}/api/v1/category/get-category`, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`, // attach token
                },
            });

            if (data?.success) {
                setCategories(data.category);
            }
        } catch (error) {
            console.log("GET CATEGORY ERROR 👉", error);
            toast.error("Something went wrong in getting categories");
        }
    };

    useEffect(() => {
        if (auth?.token) {
            getAllCategory(); // fetch categories only if token exists
        }
    }, [auth?.token]);

    // ---------------- UPDATE CATEGORY ----------------
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                `${API}/api/v1/category/update-category/${selected._id}`,
                { name: updatedName },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            );

            if (data?.success) {
                toast.success(`${updatedName} is updated`);
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("UPDATE CATEGORY ERROR 👉", error);
            toast.error(
                error.response?.data?.message || "Something went wrong in updating category"
            );
        }
    };

    // ---------------- DELETE CATEGORY ----------------
    const handleDelete = async (pId) => {
        try {
            const { data } = await axios.delete(
                `${API}/api/v1/category/delete-category/${pId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            );

            if (data?.success) {
                toast.success("Category is deleted");
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("DELETE CATEGORY ERROR 👉", error);
            toast.error(
                error.response?.data?.message || "Something went wrong in deleting category"
            );
        }
    };

    return (
        <Layout title={"Dashboard - Create Category"}>
            <ToastContainer />
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Manage Category</h1>

                        <div className="p-3 w-50">
                            <CategoryForm
                                handleSubmit={handleSubmit}
                                value={name}
                                setValue={setName}
                            />
                        </div>

                        <div className="w-75">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories?.map((c) => (
                                        <tr key={c._id}>
                                            <td>{c.name}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary ms-2"
                                                    onClick={() => {
                                                        setVisible(true);
                                                        setUpdatedName(c.name);
                                                        setSelected(c);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger ms-2"
                                                    onClick={() => handleDelete(c._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Modal
                            onCancel={() => setVisible(false)}
                            footer={null}
                            open={visible} // AntD v5+
                        >
                            <CategoryForm
                                value={updatedName}
                                setValue={setUpdatedName}
                                handleSubmit={handleUpdate}
                            />
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateCategory;
