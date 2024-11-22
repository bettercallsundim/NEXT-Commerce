import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../db";
import OhError from "../utils/errorHandler";

export const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for the token in cookies
    let token;
    if (req.cookies.token) token = req.cookies.token;
    else if (req.headers.authorization?.split(" ")[1])
      token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new OhError(400, "Token not found");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    // console.log("🚀 ~ decoded ~ decoded:", decoded);

    // Fetch the user from the database using Prisma
    const user = await db.user.findFirst({
      where: { id: decoded.id },
      include: { cart: true }, // Include related cart items if necessary
    });
    // console.log("🚀 ~ user:", user);

    // Check if user exists
    if (!user) {
      throw new OhError(400, "User not found");
    }

    // Attach the user to the request
    req.user = user;

    // Call the next middleware
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

export const allowedDisallowed = (
  allowedRoles: string[],
  disallowedRoles: string[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req?.user?.role as string; // Assuming you have user role in req.user

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

export const checkProductOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params; // Get product ID from the URL parameters
  const userId = req?.user?.id as string; // Assuming user ID is attached to the request after authentication

  try {
    // Fetch the product by ID
    const product = await db.product.findUnique({
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
  } catch (error) {
    console.error("Error checking product ownership:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
