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
exports.getOrdersByStatus = exports.getOrdersByUser = exports.getOrderById = exports.getVendorOrders = exports.getAllOrders = exports.cancelOrder = exports.updateOrderStatus = exports.createOrder = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("../db"));
const prisma_types_1 = require("../prisma-types");
exports.createOrder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, vendorId, address, phone, cartItems } = req.body;
    try {
        // Calculate total price and prepare order items
        let totalPrice = 0;
        const orderItems = yield Promise.all(cartItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield db_1.default.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            // Check stock availability
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }
            // Calculate item total price
            const itemTotalPrice = product.price * item.quantity;
            totalPrice += itemTotalPrice;
            // Update product stock and sold fields
            yield db_1.default.product.update({
                where: { id: product.id },
                data: {
                    stock: product.stock - item.quantity,
                    sold: product.sold + item.quantity,
                },
            });
            return {
                productId: product.id,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
            };
        })));
        // Create the order in the database
        const order = yield db_1.default.order.create({
            data: {
                user: { connect: { id: userId } },
                vendor: { connect: { id: vendorId } },
                address,
                phone,
                totalPrice,
                orderStatus: "PENDING",
                products: {
                    create: orderItems,
                },
            },
            include: {
                products: true, // Include order items in the response
                user: true,
                vendor: true,
            },
        });
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Order creation failed",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
exports.updateOrderStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    try {
        // Check if the new orderStatus is valid
        if (!Object.values(prisma_types_1.OrderStatus).includes(orderStatus)) {
            res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
            return;
        }
        // Update the order status
        const updatedOrder = yield db_1.default.order.update({
            where: { id: orderId },
            data: {
                orderStatus,
                deliveredAt: orderStatus === "DELIVERED" ? new Date() : undefined,
                paidAt: orderStatus === "DELIVERED" ? new Date() : undefined,
            },
        });
        res.status(200).json({
            success: true,
            message: `Order status updated to ${orderStatus}`,
            data: updatedOrder,
        });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Order status update failed",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
exports.cancelOrder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        // Fetch the order with associated items
        const order = yield db_1.default.order.findUnique({
            where: { id: orderId },
            include: { products: true }, // products = OrderItem array
        });
        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found",
            });
            return;
        }
        // Check if the order is already cancelled
        if (order.orderStatus === prisma_types_1.OrderStatus.CANCELLED) {
            res.status(400).json({
                success: false,
                message: "Order is already cancelled",
            });
            return;
        }
        // Reverse stock and sold changes for each product in the order
        const updateProductPromises = order.products.map((orderItem) => db_1.default.product.update({
            where: { id: orderItem.productId },
            data: {
                stock: {
                    increment: orderItem.quantity, // Re-add quantity to stock
                },
                sold: {
                    decrement: orderItem.quantity, // Subtract quantity from sold
                },
            },
        }));
        yield Promise.all(updateProductPromises);
        // Update the order status to CANCELLED
        const cancelledOrder = yield db_1.default.order.update({
            where: { id: orderId },
            data: { orderStatus: prisma_types_1.OrderStatus.CANCELLED },
        });
        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: cancelledOrder,
        });
    }
    catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel the order",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
exports.getAllOrders = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Pagination parameters (default to 1st page, 10 items per page)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Fetch orders with related user, products, and vendor details
        const orders = yield db_1.default.order.findMany({
            skip,
            take: limit,
            include: {
                user: true,
                products: {
                    include: {
                        product: true,
                    },
                },
                vendor: true,
            },
            orderBy: { createdAt: "desc" }, // Orders sorted by newest first
        });
        // Count total orders for pagination
        const totalOrders = yield db_1.default.order.count();
        // Calculate total pages
        const totalPages = Math.ceil(totalOrders / limit);
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: {
                orders,
                pagination: {
                    totalOrders,
                    currentPage: page,
                    totalPages,
                    perPage: limit,
                },
            },
        });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
exports.getVendorOrders = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendorId } = req.params; // Vendor ID from request parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Fetch orders that belong to the vendor, including related user and products details
        const orders = yield db_1.default.order.findMany({
            where: { vendorId },
            skip,
            take: limit,
            include: {
                user: true,
                products: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        // Count total orders for pagination
        const totalOrders = yield db_1.default.order.count({
            where: { vendorId },
        });
        const totalPages = Math.ceil(totalOrders / limit);
        res.status(200).json({
            success: true,
            message: "Vendor orders fetched successfully",
            data: {
                orders,
                pagination: {
                    totalOrders,
                    currentPage: page,
                    totalPages,
                    perPage: limit,
                },
            },
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error fetching vendor orders:", errorMessage);
        res.status(500).json({
            success: false,
            message: "Failed to fetch vendor orders",
            error: errorMessage,
        });
    }
}));
exports.getOrderById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params; // Order ID from request parameters
        // Find the order by its ID, including user and product details
        const order = yield db_1.default.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                vendor: true,
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        // If the order is not found, return a 404 response
        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found",
            });
            return;
        }
        // Return the order details if found
        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error fetching order:", errorMessage);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: errorMessage,
        });
    }
}));
exports.getOrdersByUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params; // User ID from request parameters
        // Find all orders for the specific user, including product and vendor details
        const orders = yield db_1.default.order.findMany({
            where: { userId },
            include: {
                vendor: true,
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        // If no orders are found for the user, return a 404 response
        if (orders.length === 0) {
            res.status(404).json({
                success: false,
                message: "No orders found for this user",
            });
            return;
        }
        // Return the list of orders if found
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error fetching orders by user:", errorMessage);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders for this user",
            error: errorMessage,
        });
    }
}));
exports.getOrdersByStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params; // Order status from request parameters
        // Validate the status to ensure it's a valid OrderStatus
        if (!Object.values(prisma_types_1.OrderStatus).includes(status)) {
            res.status(400).json({
                success: false,
                message: "Invalid order status provided",
            });
            return;
        }
        // Find all orders with the specified status
        const orders = yield db_1.default.order.findMany({
            where: { orderStatus: status },
            include: {
                vendor: true,
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        // If no orders are found for the specified status, return a 404 response
        if (orders.length === 0) {
            res.status(404).json({
                success: false,
                message: "No orders found for this status",
            });
            return;
        }
        // Return the list of orders if found
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error fetching orders by status:", errorMessage);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders by status",
            error: errorMessage,
        });
    }
}));
