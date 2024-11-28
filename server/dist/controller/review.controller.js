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
exports.deleteReview = exports.editReview = exports.createReview = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("../db"));
exports.createReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, rating, comment } = req.body; // Extract data from request body
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user's ID is available in the request
        // Validate the incoming data
        if (!productId || rating == null || !userId) {
            res.status(400).json({
                success: false,
                message: "Product ID, rating, and user ID are required",
            });
            return;
        }
        // Check if the product exists
        const product = yield db_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
            return;
        }
        // Create the review in the database
        const review = yield db_1.default.review.create({
            data: {
                rating,
                comment,
                user: { connect: { id: userId } }, // Associate the review with the user
                product: { connect: { id: productId } }, // Associate the review with the product
            },
        });
        // Return a successful response
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error creating review:", errorMessage);
        res.status(500).json({
            success: false,
            message: "Failed to create review",
            error: errorMessage,
        });
    }
}));
exports.editReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { reviewId } = req.params; // Review ID from the route parameters
        const { rating, comment } = req.body; // New data from the request body
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user's ID is available in the request
        // Validate the incoming data
        if (!reviewId || (rating == null && !comment)) {
            res.status(400).json({
                success: false,
                message: "Review ID is required and at least one field to update (rating or comment) must be provided",
            });
            return;
        }
        // Find the review to update
        const existingReview = yield db_1.default.review.findUnique({
            where: { id: reviewId },
        });
        if (!existingReview) {
            res.status(404).json({
                success: false,
                message: "Review not found",
            });
            return;
        }
        // Check if the user is the owner of the review
        if (existingReview.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to edit this review",
            });
            return;
        }
        // Update the review with new data
        const updatedReview = yield db_1.default.review.update({
            where: { id: reviewId },
            data: Object.assign(Object.assign({}, (rating != null && { rating })), (comment && { comment })),
        });
        // Return a successful response
        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error editing review:", errorMessage);
        res.status(500).json({
            success: false,
            message: "Failed to edit review",
            error: errorMessage,
        });
    }
}));
exports.deleteReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { reviewId } = req.params; // Review ID from the route parameters
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user's ID is available in the request
        // Validate the incoming data
        if (!reviewId) {
            res.status(400).json({
                success: false,
                message: "Review ID is required",
            });
            return;
        }
        // Find the review to delete
        const existingReview = yield db_1.default.review.findUnique({
            where: { id: reviewId },
        });
        if (!existingReview) {
            res.status(404).json({
                success: false,
                message: "Review not found",
            });
            return;
        }
        // Check if the user is the owner of the review
        if (existingReview.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to delete this review",
            });
            return;
        }
        // Delete the review
        yield db_1.default.review.delete({
            where: { id: reviewId },
        });
        // Return a successful response
        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error deleting review:", errorMessage);
        res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: errorMessage,
        });
    }
}));
