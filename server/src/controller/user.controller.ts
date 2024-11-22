import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import db from "../db";
import generateJWT from "../lib/generateJWT";
import OhError from "../utils/errorHandler";

export const googleSignIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // extract name, email and avatar from request body
    const { name, email, picture: avatar = "" } = req.body;

    if (!name || !email) {
      throw new OhError(400, "All fields are required");
    }
    // find the user from db
    let user = await db.user.findFirst({ where: { email } });

    // if not found, create a new user
    if (!user) {
      user = await db.user.create({
        data: {
          name,
          email,
          avatar,
          role: "CUSTOMER",
        },
      });
    }
    // if any error, throw an error
    if (!user) {
      throw new OhError(400, "User not created");
    }

    // else generate a token and send it to the client
    const token = generateJWT(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        data: user,
        message: "Signed In Successfully !",
      });
  }
);

export const signOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "Signed Out Successfully !",
      });
  }
);

export const authPersist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
 
    if (req?.user?.id) {
      res.status(200).json({
        success: true,
        data: req.user,
        message: "User fetched Successfully !",
      });
    }
  }
);

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new OhError(400, "User ID is required");
    }
    const user = await db.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new OhError(404, "User not found");
    }
    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  }
);

// export const manageCart = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     let cart: CartItem[] | [] = req.body.cart;
//     cart = cart.map((item) => ({
//       product: new mongoose.Types.ObjectId(item.product as string),
//       quantity: item.quantity,
//     }));

//     const user: IUser | null = await userModel.findById(req?.user?._id);
//     if (!user) {
//       throw new OhError(404, "User not found");
//     }

//     user.cart = cart;
//     await user.save();
//     res.status(200).json({
//       success: true,
//       message: "Cart updated successfully",
//       data: user,
//     });
//   }
// );

export const getAllUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await db.user.findMany();
    res.status(200).json({
      success: true,
      message: "Users found",
      data: users,
    });
  }
);
