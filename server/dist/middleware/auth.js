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
exports.checkProductOwnership = exports.allowedDisallowed = exports.authCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const authCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Check for the token in cookies
        let token;
        if (req.cookies.token)
            token = req.cookies.token;
        else if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1])
            token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
        if (!token) {
            throw new errorHandler_1.default(400, "Token not found");
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // console.log("🚀 ~ decoded ~ decoded:", decoded);
        // Fetch the user from the database using Prisma
        const user = yield db_1.default.user.findFirst({
            where: { id: decoded.id },
            include: { cart: true }, // Include related cart items if necessary
        });
        // console.log("🚀 ~ user:", user);
        // Check if user exists
        if (!user) {
            throw new errorHandler_1.default(400, "User not found");
        }
        // Attach the user to the request
        req.user = user;
        // Call the next middleware
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        next(error); // Pass the error to the error handling middleware
    }
});
exports.authCheck = authCheck;
const allowedDisallowed = (allowedRoles, disallowedRoles) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role; // Assuming you have user role in req.user
        if (disallowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }
        if (!allowedRoles.includes(userRole) && allowedRoles.length > 0) {
            return res.status(403).json({
                success: false,
                message: "Your role is not allowed to perform this action.",
            });
        }
        next(); // Allow the request to proceed if no restrictions are violated
    };
};
exports.allowedDisallowed = allowedDisallowed;
const checkProductOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.params; // Get product ID from the URL parameters
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming user ID is attached to the request after authentication
    try {
        // Fetch the product by ID
        const product = yield db_1.default.product.findUnique({
            where: { id: productId },
            include: { vendor: true }, // Include the vendor details
        });
        // Check if the product exists
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }
        // Check if the vendor ID of the product matches the current user's vendor ID
        if (product.vendorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this product",
            });
        }
        // If the check passes, call next middleware or controller
        next();
    }
    catch (error) {
        console.error("Error checking product ownership:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.checkProductOwnership = checkProductOwnership;
