"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByCategory = exports.getProduct = exports.getProducts = exports.deleteProduct = exports.editProduct = exports.createProduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("../db"));
exports.createProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, categoryId, images, colors, sizes, brandId, stock, material, style, gender, releaseDate, limitedEdition, vendorId, userId, } = req.body;
    const product = yield db_1.default.product.create({
        data: {
            name,
            description,
            price,
            categoryId,
            images: {
                create: images.map((imageUrl) => ({ url: imageUrl })),
            },
            colors: {
                create: colors.map(({ name, code }) => ({
                    name,
                    code,
                })),
            },
            sizes: {
                create: sizes.map((size) => ({ value: size })),
            },
            brandId,
            stock,
            material,
            style,
            gender,
            releaseDate: releaseDate ? new Date(releaseDate) : null,
            limitedEdition,
            vendorId,
            userId,
        },
    });
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
    });
}));
exports.editProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params; // Get the product ID from the URL parameters
    const { name, description, price, categoryId, images, colors, sizes, brandId, stock, material, style, gender, releaseDate, limitedEdition, vendorId, userId, } = req.body;
    // Check if the product exists
    const existingProduct = yield db_1.default.product.findUnique({
        where: { id: productId },
    });
    if (!existingProduct) {
        res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    // Update the product
    const updatedProduct = yield db_1.default.product.update({
        where: { id: productId },
        data: {
            name,
            description,
            price,
            categoryId,
            images: {
                // Upsert images (create or connect existing)
                deleteMany: {}, // Clear existing images
                create: images.map((imageUrl) => ({ url: imageUrl })),
            },
            colors: {
                // Handle colors (upsert logic)
                deleteMany: {}, // Clear existing colors
                create: colors.map(({ name, code }) => ({
                    name,
                    code,
                })),
            },
            sizes: {
                // Handle sizes (upsert logic)
                deleteMany: {}, // Clear existing sizes
                create: sizes.map((size) => ({ value: size })),
            },
            brandId,
            stock,
            material,
            style,
            gender,
            releaseDate: releaseDate ? new Date(releaseDate) : null,
            limitedEdition,
            vendorId,
            userId,
        },
    });
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
    });
}));
exports.deleteProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params; // Get the product ID from the URL parameters
    // Check if the product exists
    const existingProduct = yield db_1.default.product.findUnique({
        where: { id: productId },
    });
    if (!existingProduct) {
        res.status(404).json({
            success: false,
            message: "Product not found",
        });
        return; // Ensure no further execution after response
    }
    // Delete the product
    yield db_1.default.product.delete({
        where: { id: productId },
    });
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
}));
exports.getProducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield db_1.default.product.findMany();
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
    });
}));
exports.getProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    // Find the product by ID
    const product = yield db_1.default.product.findUnique({
        where: { id: productId },
        include: {
            images: true,
            colors: true,
            sizes: true,
            brand: true,
            vendor: true,
            reviews: true,
        },
    });
    if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
    }
    // Fetch category breadcrumbs
    let breadcrumbs = [];
    if (product.categoryId) {
        const category = yield db_1.default.category.findUnique({
            where: { id: product.categoryId },
        });
        if (category) {
            breadcrumbs.push(category);
            if (category.parentId) {
                yield fetchParentCategories(category.parentId);
            }
        }
    }
    // Helper function to recursively fetch parent categories
    function fetchParentCategories(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const parentCategory = yield db_1.default.category.findUnique({
                where: { id: parentId },
            });
            if (parentCategory) {
                breadcrumbs.push(parentCategory);
                if (parentCategory.parentId) {
                    yield fetchParentCategories(parentCategory.parentId);
                }
            }
        });
    }
    // Reverse breadcrumbs to get the correct order
    breadcrumbs.reverse();
    res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: Object.assign(Object.assign({}, product), { categories: breadcrumbs }),
    });
}));
exports.getProductsByCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.category;
    let childCategories = [];
    // Fetch all child categories recursively
    const aggregateCategories = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find the root category
            const rootCategory = yield db_1.default.category.findUnique({
                where: { id: categoryId },
            });
            if (rootCategory) {
                childCategories.push(rootCategory);
                yield fetchChildren(rootCategory.id);
            }
        }
        catch (error) {
            console.error("Error aggregating categories:", error);
            throw error;
        }
    });
    // Fetch child categories recursively based on the parentId relationship
    const fetchChildren = (parentId) => __awaiter(void 0, void 0, void 0, function* () {
        const children = yield db_1.default.category.findMany({
            where: { parentId },
        });
        for (const child of children) {
            childCategories.push(child);
            yield fetchChildren(child.id); // Recursive call to fetch further nested children
        }
    });
    // Start category aggregation
    yield aggregateCategories();
    // Fetch products by category IDs
    const categoryIds = childCategories.map((cat) => cat.id);
    const products = yield db_1.default.product.findMany({
        where: { categoryId: { in: categoryIds } },
        include: {
            category: true,
        },
    });
    if (!products || products.length === 0) {
        res.status(404).json({ success: false, message: "Products not found" });
        return;
    }
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
    });
}));
