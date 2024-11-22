import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import db from "../db";
import { OrderStatus } from "../prisma-types";

export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, vendorId, address, phone, cartItems } = req.body;

    try {
      // Calculate total price and prepare order items
      let totalPrice = 0;
      const orderItems = await Promise.all(
        cartItems.map(
          async (item: {
            productId: string;
            quantity: number;
            color?: string;
            size?: string;
          }) => {
            const product = await db.product.findUnique({
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
            await db.product.update({
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
          }
        )
      );

      // Create the order in the database
      const order = await db.order.create({
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
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(500).json({
        success: false,
        message: "Order creation failed",
        error: error?.message,
      });
    }
  }
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    try {
      // Check if the new orderStatus is valid
      if (!Object.values(OrderStatus).includes(orderStatus)) {
        res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
        return;
      }

      // Update the order status
      const updatedOrder = await db.order.update({
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
    } catch (error: any) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        success: false,
        message: "Order status update failed",
        error: error?.message,
      });
    }
  }
);

export const cancelOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    try {
      // Fetch the order with associated items
      const order = await db.order.findUnique({
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
      if (order.orderStatus === OrderStatus.CANCELLED) {
        res.status(400).json({
          success: false,
          message: "Order is already cancelled",
        });
        return;
      }

      // Reverse stock and sold changes for each product in the order
      const updateProductPromises = order.products.map((orderItem) =>
        db.product.update({
          where: { id: orderItem.productId },
          data: {
            stock: {
              increment: orderItem.quantity, // Re-add quantity to stock
            },
            sold: {
              decrement: orderItem.quantity, // Subtract quantity from sold
            },
          },
        })
      );

      await Promise.all(updateProductPromises);

      // Update the order status to CANCELLED
      const cancelledOrder = await db.order.update({
        where: { id: orderId },
        data: { orderStatus: OrderStatus.CANCELLED },
      });

      res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: cancelledOrder,
      });
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel the order",
        error: error?.message,
      });
    }
  }
);

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Pagination parameters (default to 1st page, 10 items per page)
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Fetch orders with related user, products, and vendor details
      const orders = await db.order.findMany({
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
      const totalOrders = await db.order.count();

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
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error?.message,
      });
    }
  }
);

export const getVendorOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vendorId } = req.params; // Vendor ID from request parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Fetch orders that belong to the vendor, including related user and products details
      const orders = await db.order.findMany({
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
      const totalOrders = await db.order.count({
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      console.error("Error fetching vendor orders:", errorMessage);
      res.status(500).json({
        success: false,
        message: "Failed to fetch vendor orders",
        error: errorMessage,
      });
    }
  }
);

export const getOrderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params; // Order ID from request parameters

      // Find the order by its ID, including user and product details
      const order = await db.order.findUnique({
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      console.error("Error fetching order:", errorMessage);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order",
        error: errorMessage,
      });
    }
  }
);

export const getOrdersByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params; // User ID from request parameters

      // Find all orders for the specific user, including product and vendor details
      const orders = await db.order.findMany({
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      console.error("Error fetching orders by user:", errorMessage);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders for this user",
        error: errorMessage,
      });
    }
  }
);

export const getOrdersByStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.params; // Order status from request parameters

      // Validate the status to ensure it's a valid OrderStatus
      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        res.status(400).json({
          success: false,
          message: "Invalid order status provided",
        });
        return;
      }

      // Find all orders with the specified status
      const orders = await db.order.findMany({
        where: { orderStatus: status as OrderStatus },
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      console.error("Error fetching orders by status:", errorMessage);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders by status",
        error: errorMessage,
      });
    }
  }
);
