import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import db from "../db";
import { Category } from "../prisma-types";
import OhError from "../utils/errorHandler";

export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, iconUrl, iconPublicId, parentId } = req.body;

    try {
      // Create a new category with optional parent category
      const newCategory = await db.category.create({
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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating category",
      });
    }
  }
);

async function fetchParentCategoriesForBreadcrumbs(
  categoryId: string
): Promise<any[]> {
  // Fetch the category along with its parent
  const category = await db.category.findUnique({
    where: { id: categoryId },
    include: {
      parent: true, // Include the parent category
    },
  });

  if (!category) {
    throw new OhError(404, "Category not found");
  }

  // Base case: if there is no parent, return this category (root category)
  if (!category.parent) {
    return [category];
  }

  // Recursive case: get the breadcrumb trail of parent categories
  const parentBreadcrumb = await fetchParentCategoriesForBreadcrumbs(
    category.parent.id
  );

  // Add the current category to the breadcrumb trail and return
  return [...parentBreadcrumb, category];
}

// API handler to fetch a category and its breadcrumb trail
export const getCategoryBreadcrumb = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    try {
      // Fetch the breadcrumb trail (parent categories)
      const breadcrumbTrail = await fetchParentCategoriesForBreadcrumbs(
        categoryId
      );

      res.status(200).json({
        success: true,
        breadcrumb: breadcrumbTrail,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
      });
    }
  }
);

async function fetchChildCategoriesRecursive(
  categoryId: string
): Promise<(Category & { childrens: Category[] }) | Category> {
  // Fetch the category along with its children
  const category = await db.category.findUnique({
    where: { id: categoryId },
    include: {
      childrens: true, // Include child categories
    },
  });

  if (!category) {
    throw new OhError(404, "Category not found");
  }

  // Base case: if there are no children, return the category
  if (!category.childrens || category.childrens.length === 0) {
    return category;
  }

  // Recursive case: for each child, fetch its children recursively
  const childCategories = await Promise.all(
    category.childrens.map(async (childCategory) => {
      return fetchChildCategoriesRecursive(childCategory.id);
    })
  );

  // Return the category with all of its children (including nested children)
  return {
    ...category,
    childrens: childCategories,
  };
}

// API handler to fetch a category and all its child categories recursively
export const getCategoryWithChildren = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    try {
      const category = await fetchChildCategoriesRecursive(categoryId);

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
      });
    }
  }
);

const deleteCategoryRecursive = async (categoryId: string) => {
  const category = await db.category.findUnique({
    where: { id: categoryId },
    include: {
      childrens: true,
    },
  });

  if (!category) {
    throw new OhError(404, "Category not found");
  }

  if (category.childrens.length > 0) {
    await Promise.all(
      category.childrens.map(async (childCategory) => {
        await deleteCategoryRecursive(childCategory.id);
      })
    );
  }

  await db.category.delete({
    where: { id: categoryId },
  });
};

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    try {
      await deleteCategoryRecursive(categoryId);

      res.status(200).json({
        success: true,
        message: "Category and its children deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete category",
      });
    }
  }
);
