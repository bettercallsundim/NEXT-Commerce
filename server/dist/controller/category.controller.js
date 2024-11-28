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
exports.deleteCategory = exports.getCategoryWithChildren = exports.getCategoryBreadcrumb = exports.createCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
exports.createCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, iconUrl, iconPublicId, parentId } = req.body;
    try {
        // Create a new category with optional parent category
        const newCategory = yield db_1.default.category.create({
            data: {
                name,
                description,
                iconUrl,
                iconPublicId,
                parent: parentId ? { connect: { id: parentId } } : undefined,
            },
        });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating category",
        });
    }
}));
function fetchParentCategoriesForBreadcrumbs(categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch the category along with its parent
        const category = yield db_1.default.category.findUnique({
            where: { id: categoryId },
            include: {
                parent: true, // Include the parent category
            },
        });
        if (!category) {
            throw new errorHandler_1.default(404, "Category not found");
        }
        // Base case: if there is no parent, return this category (root category)
        if (!category.parent) {
            return [category];
        }
        // Recursive case: get the breadcrumb trail of parent categories
        const parentBreadcrumb = yield fetchParentCategoriesForBreadcrumbs(category.parent.id);
        // Add the current category to the breadcrumb trail and return
        return [...parentBreadcrumb, category];
    });
}
// API handler to fetch a category and its breadcrumb trail
exports.getCategoryBreadcrumb = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        // Fetch the breadcrumb trail (parent categories)
        const breadcrumbTrail = yield fetchParentCategoriesForBreadcrumbs(categoryId);
        res.status(200).json({
            success: true,
            breadcrumb: breadcrumbTrail,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
}));
function fetchChildCategoriesRecursive(categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch the category along with its children
        const category = yield db_1.default.category.findUnique({
            where: { id: categoryId },
            include: {
                childrens: true, // Include child categories
            },
        });
        if (!category) {
            throw new errorHandler_1.default(404, "Category not found");
        }
        // Base case: if there are no children, return the category
        if (!category.childrens || category.childrens.length === 0) {
            return category;
        }
        // Recursive case: for each child, fetch its children recursively
        const childCategories = yield Promise.all(category.childrens.map((childCategory) => __awaiter(this, void 0, void 0, function* () {
            return fetchChildCategoriesRecursive(childCategory.id);
        })));
        // Return the category with all of its children (including nested children)
        return Object.assign(Object.assign({}, category), { childrens: childCategories });
    });
}
// API handler to fetch a category and all its child categories recursively
exports.getCategoryWithChildren = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        const category = yield fetchChildCategoriesRecursive(categoryId);
        res.status(200).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
}));
const deleteCategoryRecursive = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield db_1.default.category.findUnique({
        where: { id: categoryId },
        include: {
            childrens: true,
        },
    });
    if (!category) {
        throw new errorHandler_1.default(404, "Category not found");
    }
    if (category.childrens.length > 0) {
        yield Promise.all(category.childrens.map((childCategory) => __awaiter(void 0, void 0, void 0, function* () {
            yield deleteCategoryRecursive(childCategory.id);
        })));
    }
    yield db_1.default.category.delete({
        where: { id: categoryId },
    });
});
exports.deleteCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        yield deleteCategoryRecursive(categoryId);
        res.status(200).json({
            success: true,
            message: "Category and its children deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
        });
    }
}));
