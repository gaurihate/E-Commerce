import React, { useEffect, useState } from "react";
import Layout from "../../component/layout/Layout.jsx";
import AdminMenu from "../../component/layout/AdminMenu.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";

const { Option } = Select;

const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [auth] = useAuth();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [photo, setPhoto] = useState(null);
    const [id, setId] = useState("");

    // ================= GET SINGLE PRODUCT =================
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            const p = data.product;
            setName(p.name);
            setId(p._id);
            setDescription(p.description);
            setPrice(p.price);
            setQuantity(p.quantity);
            setShipping(p.shipping);
            setCategory(p.category._id);
        } catch (error) {
            console.log("Get single product error:", error);
            toast.error("Error fetching product details");
        }
    };

    // ================= GET ALL CATEGORIES =================
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) setCategories(data.category);
        } catch (error) {
            console.log("Get categories error:", error);
            toast.error("Something went wrong in getting categories");
        }
    };

    useEffect(() => {
        getSingleProduct();
        getAllCategory();
        //eslint-disable-next-line
    }, []);

    // ================= UPDATE PRODUCT =================
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("category", category);
            productData.append("shipping", shipping);
            if (photo) productData.append("photo", photo);

            const { data } = await axios.put(`/api/v1/product/update-product/${id}`, productData, {
                headers: { Authorization: `Bearer ${auth?.token}` },
            });

            if (data?.success) {
                toast.success(data?.message);
                navigate("/dashboard/admin/products");
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log("Update product error:", error);
            toast.error("Something went wrong while updating product");
        }
    };

    // ================= DELETE PRODUCT =================
    const handleDelete = async () => {
        try {
            const answer = window.prompt("Are you sure you want to delete this product? Type YES to confirm.");
            if (answer?.toLowerCase() !== "yes") return;

            await axios.delete(`/api/v1/product/${id}`, {
                headers: { Authorization: `Bearer ${auth?.token}` },
            });

            toast.success("Product deleted successfully");
            navigate("/dashboard/admin/products");
        } catch (error) {
            console.log("Delete product error:", error);
            toast.error("Something went wrong while deleting product");
        }
    };

    return (
        <Layout title="Dashboard - Update Product">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            {/* CATEGORY SELECT */}
                            <Select
                                placeholder="Select a category"
                                size="large"
                                showSearch
                                className="form-select mb-3"
                                onChange={(value) => setCategory(value)}
                                value={category}
                            >
                                {categories?.map((c) => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>

                            {/* PHOTO UPLOAD */}
                            <div className="mb-3">
                                <label className="btn btn-outline-secondary col-md-12">
                                    {photo ? photo.name : "Upload Photo"}
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                </label>
                            </div>

                            {/* DISPLAY PHOTO */}
                            <div className="mb-3 text-center">
                                {photo ? (
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="product_photo"
                                        height="200px"
                                        className="img img-responsive"
                                    />
                                ) : (
                                    <img
                                        src={`/api/v1/product/product-photo/${id}`}
                                        alt="product_photo"
                                        height="200px"
                                        className="img img-responsive"
                                    />
                                )}
                            </div>

                            {/* FORM FIELDS */}
                            <input
                                type="text"
                                value={name}
                                placeholder="Product Name"
                                className="form-control mb-3"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <textarea
                                value={description}
                                placeholder="Product Description"
                                className="form-control mb-3"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <input
                                type="number"
                                value={price}
                                placeholder="Price"
                                className="form-control mb-3"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <input
                                type="number"
                                value={quantity}
                                placeholder="Quantity"
                                className="form-control mb-3"
                                onChange={(e) => setQuantity(e.target.value)}
                            />

                            {/* SHIPPING SELECT */}
                            <Select
                                placeholder="Select Shipping"
                                size="large"
                                className="form-select mb-3"
                                onChange={(value) => setShipping(value)}
                                value={shipping ? "1" : "0"}
                            >
                                <Option value="0">No</Option>
                                <Option value="1">Yes</Option>
                            </Select>

                            {/* BUTTONS */}
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={handleUpdate}>
                                    UPDATE PRODUCT
                                </button>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    DELETE PRODUCT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UpdateProduct;
