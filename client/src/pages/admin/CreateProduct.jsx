import React, { useState, useEffect } from "react";
import Layout from "../../component/layout/Layout.jsx";
import AdminMenu from "../../component/layout/AdminMenu.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";

const { Option } = Select;

const CreateProduct = () => {
    const navigate = useNavigate();
    const [auth] = useAuth();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("0"); // default No
    const [photo, setPhoto] = useState(null);

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getAllCategory = async () => {
            try {
                const { data } = await axios.get(`${API}/api/v1/category/get-category`);
                if (data.success) setCategories(data.category);
            } catch (error) {
                console.log(error);
                toast.error("Error loading categories");
            }
        };
        getAllCategory();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            // CREATE FormData object inside the function
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("category", category);
            productData.append("shipping", shipping);
            if (photo) productData.append("photo", photo);

            // POST request with Axios
            const { data } = await axios.post(
                `${API}/api/v1/product/create-product`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            );

            if (data?.success) {
                toast.success("Product Created Successfully");
                navigate("/dashboard/admin/products");
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while creating product");
        }
    };

    return (
        <Layout title="Dashboard - Create Product">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Create Product</h1>
                        <div className="m-1 w-75">
                            <Select
                                variant="borderless"
                                placeholder="Select a category"
                                size="large"
                                className="form-select mb-3"
                                onChange={(value) => setCategory(value)}
                            >
                                {categories?.map((c) => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>

                            <div className="mb-3">
                                <label className="btn btn-outline-secondary col-md-12">
                                    {photo ? photo.name : "Upload Photo"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                </label>
                            </div>

                            {photo && (
                                <div className="mb-3 text-center">
                                    <img src={URL.createObjectURL(photo)} alt="product" height="200" />
                                </div>
                            )}

                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Product Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <textarea
                                className="form-control mb-3"
                                placeholder="Product Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />

                            <Select
                                variant="borderless"
                                placeholder="Shipping"
                                size="large"
                                className="form-select mb-3"
                                value={shipping}
                                onChange={(value) => setShipping(value)}
                            >
                                <Option value="0">No</Option>
                                <Option value="1">Yes</Option>
                            </Select>

                            <button className="btn btn-primary" onClick={handleCreate}>
                                CREATE PRODUCT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateProduct;
