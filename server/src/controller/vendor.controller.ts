import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import db from "../db";
import OhError from "../utils/errorHandler";

export const createVendor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // extract name, email and avatar from request body
    const { name, description } = req.body;
    let userId = req.user.id;

    if (!name || !userId) {
      throw new OhError(400, "All fields are required");
    }

    let vendor = await db.vendor.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(200).json({
      success: true,
      data: vendor,
      message: "Vendor Created Successfully !",
    });
  }
);

export const updateVendor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, logo, id } = req.body;

    const vendor = await db.vendor.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        logo,
      },
    });

    res.status(200).json({
      success: true,
      data: vendor,
      message: "Vendor Updated Successfully !",
    });
  }
);

export const deleteVendor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await db.vendor.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Vendor Deleted Successfully !",
    });
  }
);

export const getAllVendors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await db.vendor.findMany();

    res.status(200).json({
      success: true,
      data: vendors,
      message: "Vendors Fetched Successfully !",
    });
  }
);

export const getAllVendorsByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId  = req.user.id;

    const vendors = await db.vendor.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json({
      success: true,
      data: vendors,
      message: "Vendors Fetched Successfully !",
    });
  }
);
