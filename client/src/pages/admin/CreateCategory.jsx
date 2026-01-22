import React, { useEffect, useState } from "react";
import Layout from "../../component/layout/Layout.jsx";
import AdminMenu from "../../component/layout/AdminMenu.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import CategoryForm from "../../component/Form/CategoryForm.jsx";
import { Modal } from "antd";
import { useAuth } from "../../context/auth.jsx";

const CreateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    const [auth] = useAuth();

    // ================= CREATE CATEGORY =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "/api/v1/category/create-category",
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
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
            console.log(error);
            toast.error(
                error.response?.data?.message ||
                "Something went wrong in creating category"
            );
        }
    };

    // ================= GET ALL CATEGORY =================
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(
                "/api/v1/category/get-category",
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            );

            if (data?.success) {
                setCategories(data.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting categories");
        }
    };

    useEffect(() => {
        if (auth?.token) getAllCategory();
    }, [auth?.token]);

    // ================= UPDATE CATEGORY =================
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                `/api/v1/category/update-category/${selected._id}`,
                { name: updatedName },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            );

            if (data?.success) {
                toast.success(`${updatedName} is updated`);
                setVisible(false);
                setSelected(null);
                setUpdatedName("");
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message ||
                "Something went wrong in updating category"
            );
        }
    };

    // ================= DELETE CATEGORY =================
    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(
                `/api/v1/category/delete-category/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            );

            if (data?.success) {
                toast.success("Category deleted");
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message ||
                "Something went wrong in deleting category"
            );
        }
    };

    return (
        <Layout title="Dashboard - Create Category">
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
                                        <th>Name</th>
                                        <th>Actions</th>
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
                            open={visible}
                            onCancel={() => setVisible(false)}
                            footer={null}
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
