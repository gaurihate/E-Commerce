import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js"; // 🔥 MISSING LINE
import fs from "fs/promises";
import slugify from "slugify";

// ================= CREATE PRODUCT =================
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields || {};
        const { photo } = req.files || {};

        // validations
        if (!name) return res.status(400).send({ error: "Name is required" });
        if (!description) return res.status(400).send({ error: "Description is required" });
        if (!price) return res.status(400).send({ error: "Price is required" });
        if (!category) return res.status(400).send({ error: "Category is required" });
        if (!quantity) return res.status(400).send({ error: "Quantity is required" });

        if (photo && photo.size > 1000000) {
            return res.status(400).send({ error: "Photo must be less than 1MB" });
        }

        const product = new productModel({
            name,
            description,
            price,
            category,
            quantity,
            shipping: shipping === "1",
            slug: slugify(name),
        });

        // ✅ PHOTO FIX (IMPORTANT)
        if (photo) {
            const photoPath = photo.filepath || photo.path;
            product.photo.data = await fs.readFile(photoPath);
            product.photo.contentType = photo.mimetype;
        }

        await product.save();

        res.status(201).send({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating product",
            error: error.message,
        });
    }
};

// ================= GET ALL PRODUCTS =================
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error getting products",
            error: error.message,
        });
    }
};

// ================= GET SINGLE PRODUCT =================
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .populate("category")
            .select("-photo");

        res.status(200).send({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error getting product",
            error: error.message,
        });
    }
};

// ================= PRODUCT PHOTO =================
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel
            .findById(req.params.pid)
            .select("photo");

        // ✅ SAFE CHECK
        if (
            !product ||
            !product.photo ||
            !product.photo.data
        ) {
            return res.status(200).sendFile(
                process.cwd() + "/public/no-image.png"
            );
        }

        res.set("Content-Type", product.photo.contentType);
        return res.status(200).send(product.photo.data);

    } catch (error) {
        console.log("PHOTO ERROR ❌", error);
        return res.status(500).send({
            success: false,
            message: "Error getting photo",
        });
    }
};


// ================= UPDATE PRODUCT =================
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields || {};
        const { photo } = req.files || {};

        const product = await productModel.findByIdAndUpdate(
            req.params.pid,
            {
                name,
                description,
                price,
                category,
                quantity,
                shipping: shipping === "1",
                ...(name && { slug: slugify(name) }),
            },
            { new: true }
        );


        if (photo) {
            const photoPath = photo.filepath || photo.path;
            product.photo.data = await fs.readFile(photoPath);
            product.photo.contentType = photo.mimetype;
            await product.save();
        }

        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error updating product",
            error: error.message,
        });
    }
};

// ================= DELETE PRODUCT =================
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid);
        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error deleting product",
            error: error.message,
        });
    }
};


// filters
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Filtering Products",
            error,
        });
    }
};

// product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in product count",
            error,
            success: false,
        });
    }
};

// product list base on page
export const productListController = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
};



// search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;

        const products = await productModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            })
            .select("-photo");

        res.status(200).send({
            success: true,
            products,
        });

    } catch (error) {
        console.log("SEARCH ERROR ❌", error);
        res.status(500).send({
            success: false,
            message: "Search failed",
        });
    }
};

// similar products
export const realtedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while geting related product",
            error,
        });
    }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });

        const products = await productModel
            .find({ category })
            .populate("category")
            .select("-photo");

        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting products by category",
        });
    }
};
