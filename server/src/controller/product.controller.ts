import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import db from "../db";
import OhError from "../utils/errorHandler";

export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      description,
      price,
      categoryId,
      images,
      colors,
      sizes,
      brandId,
      stock,
      material,
      style,
      gender,
      releaseDate,
      limitedEdition,
      vendorId,
      userId,
    } = req.body;

    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        images: {
          create: images.map((imageUrl: string) => ({ url: imageUrl })),
        },
        colors: {
          create: colors.map(
            ({ name, code }: { name: string; code: string }) => ({
              name,
              code,
            })
          ),
        },
        sizes: {
          create: sizes.map((size: string) => ({ value: size })),
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
  }
);

export const editProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.params; // Get the product ID from the URL parameters
    const {
      name,
      description,
      price,
      categoryId,
      images,
      colors,
      sizes,
      brandId,
      stock,
      material,
      style,
      gender,
      releaseDate,
      limitedEdition,
      vendorId,
      userId,
    } = req.body;

    // Check if the product exists
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update the product
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        categoryId,
        images: {
          // Upsert images (create or connect existing)
          deleteMany: {}, // Clear existing images
          create: images.map((imageUrl: string) => ({ url: imageUrl })),
        },
        colors: {
          // Handle colors (upsert logic)
          deleteMany: {}, // Clear existing colors
          create: colors.map(
            ({ name, code }: { name: string; code: string }) => ({
              name,
              code,
            })
          ),
        },
        sizes: {
          // Handle sizes (upsert logic)
          deleteMany: {}, // Clear existing sizes
          create: sizes.map((size: string) => ({ value: size })),
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
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.params; // Get the product ID from the URL parameters

    // Check if the product exists
    const existingProduct = await db.product.findUnique({
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
    await db.product.delete({
      where: { id: productId },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);

export const getProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await db.product.findMany();
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  }
);

export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: productId } = req.params;

    // Find the product by ID
    const product = await db.product.findUnique({
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
      const category = await db.category.findUnique({
        where: { id: product.categoryId },
      });

      if (category) {
        breadcrumbs.push(category);
        if (category.parentId) {
          await fetchParentCategories(category.parentId);
        }
      }
    }

    // Helper function to recursively fetch parent categories
    async function fetchParentCategories(parentId: string) {
      const parentCategory = await db.category.findUnique({
        where: { id: parentId },
      });
      if (parentCategory) {
        breadcrumbs.push(parentCategory);
        if (parentCategory.parentId) {
          await fetchParentCategories(parentCategory.parentId);
        }
      }
    }

    // Reverse breadcrumbs to get the correct order
    breadcrumbs.reverse();

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: {
        ...product,
        categories: breadcrumbs,
      },
    });
  }
);

export const getProductsByCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.category;
    let childCategories: any[] = [];

    // Fetch all child categories recursively
    const aggregateCategories = async () => {
      try {
        // Find the root category
        const rootCategory = await db.category.findUnique({
          where: { id: categoryId },
        });

        if (rootCategory) {
          childCategories.push(rootCategory);
          await fetchChildren(rootCategory.id);
        }
      } catch (error) {
        console.error("Error aggregating categories:", error);
        throw error;
      }
    };

    // Fetch child categories recursively based on the parentId relationship
    const fetchChildren = async (parentId: string) => {
      const children = await db.category.findMany({
        where: { parentId },
      });

      for (const child of children) {
        childCategories.push(child);
        await fetchChildren(child.id); // Recursive call to fetch further nested children
      }
    };

    // Start category aggregation
    await aggregateCategories();

    // Fetch products by category IDs
    const categoryIds = childCategories.map((cat) => cat.id);
    const products = await db.product.findMany({
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
  }
);
