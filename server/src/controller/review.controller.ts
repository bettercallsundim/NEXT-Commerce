import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import db from "../db";

export const createReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, rating, comment } = req.body; // Extract data from request body
      const userId = req?.user?.id; // Assuming the user's ID is available in the request

      // Validate the incoming data
      if (!productId || rating == null || !userId) {
        res.status(400).json({
          success: false,
          message: "Product ID, rating, and user ID are required",
        });
        return;
      }

      // Check if the product exists
      const product = await db.product.findUnique({
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
      const review = await db.review.create({
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      console.error("Error creating review:", errorMessage);
      res.status(500).json({
        success: false,
        message: "Failed to create review",
        error: errorMessage,
      });
    }
  }
);

export const editReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId } = req.params; // Review ID from the route parameters
      const { rating, comment } = req.body; // New data from the request body
      const userId = req?.user?.id; // Assuming the user's ID is available in the request

      // Validate the incoming data
      if (!reviewId || (rating == null && !comment)) {
        res.status(400).json({
          success: false,
          message:
            "Review ID is required and at least one field to update (rating or comment) must be provided",
        });
        return;
      }

      // Find the review to update
      const existingReview = await db.review.findUnique({
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
      const updatedReview = await db.review.update({
        where: { id: reviewId },
        data: {
          ...(rating != null && { rating }), // Update rating if provided
          ...(comment && { comment }), // Update comment if provided
        },
      });

      // Return a successful response
      res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: updatedReview,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      console.error("Error editing review:", errorMessage);
      res.status(500).json({
        success: false,
        message: "Failed to edit review",
        error: errorMessage,
      });
    }
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId } = req.params; // Review ID from the route parameters
      const userId = req?.user?.id; // Assuming the user's ID is available in the request

      // Validate the incoming data
      if (!reviewId) {
        res.status(400).json({
          success: false,
          message: "Review ID is required",
        });
        return;
      }

      // Find the review to delete
      const existingReview = await db.review.findUnique({
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
      await db.review.delete({
        where: { id: reviewId },
      });

      // Return a successful response
      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      console.error("Error deleting review:", errorMessage);
      res.status(500).json({
        success: false,
        message: "Failed to delete review",
        error: errorMessage,
      });
    }
  }
);
