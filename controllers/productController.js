import productModel from "../models/productModel.js";
import fs from "fs/promises";
import slugify from "slugify";

// CREATE PRODUCT
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validation
        if (!name) return res.status(400).send({ error: "Name is required" });
        if (!description) return res.status(400).send({ error: "Description is required" });
        if (!price) return res.status(400).send({ error: "Price is required" });
        if (!category) return res.status(400).send({ error: "Category is required" });
        if (!quantity) return res.status(400).send({ error: "Quantity is required" });

        const product = new productModel({
            name,
            description,
            price,
            category,
            quantity,
            shipping: shipping === "1" ? true : false, // convert to boolean
            slug: slugify(name),
        });

        // handle photo if exists
        if (photo) {
            if (photo.size > 1000000) {
                return res.status(400).send({ error: "Photo should be less than 1MB" });
            }
            product.photo.data = await fs.readFile(photo.filepath);
            product.photo.contentType = photo.mimetype;
        }

        await product.save();

        return res.status(201).send({
            success: true,
            message: "Product created successfully",
            product,
        });
        console.log("Fields:", req.fields);
        console.log("Files:", req.files);

    } catch (error) {
        console.log("CREATE PRODUCT ERROR =>", error);
        return res.status(500).send({
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
            countTotal: products.length,
            products,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in getting products",
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
            message: "Error while getting product",
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

        if (product?.photo?.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getting photo",
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
            message: "Product Deleted Successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error: error.message,
        });
    }
};

// ================= UPDATE PRODUCT =================
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields || {};

        const { photo } = req.files || {};

        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is Required" });
            case !description:
                return res.status(400).send({ error: "Description is Required" });
            case !price:
                return res.status(400).send({ error: "Price is Required" });
            case !category:
                return res.status(400).send({ error: "Category is Required" });
            case quantity === undefined:
                return res.status(400).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(400)
                    .send({ error: "Photo should be less than 1MB" });
        }

        const product = await productModel.findByIdAndUpdate(
            req.params.pid,
            {
                name,
                description,
                price,
                category,
                quantity,
                shipping: shipping === "1",
                slug: slugify(name),
            },
            { new: true }
        );

        if (photo) {
            product.photo.data = await fs.readFile(photo.filepath);
            product.photo.contentType = photo.mimetype;
            await product.save();
        }

        res.status(200).send({
            success: true,
            message: "Product Updated Successfully",
            product,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in updating product",
            error: error.message,
        });
    }
};
