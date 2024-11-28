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
exports.getAllUser = exports.getUser = exports.authPersist = exports.signOut = exports.googleSignIn = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("../db"));
const generateJWT_1 = __importDefault(require("../lib/generateJWT"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
exports.googleSignIn = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // extract name, email and avatar from request body
    const { name, email, picture: avatar = "" } = req.body;
    if (!name || !email) {
        throw new errorHandler_1.default(400, "All fields are required");
    }
    // find the user from db
    let user = yield db_1.default.user.findFirst({ where: { email } });
    // if not found, create a new user
    if (!user) {
        user = yield db_1.default.user.create({
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
        throw new errorHandler_1.default(400, "User not created");
    }
    // else generate a token and send it to the client
    const token = (0, generateJWT_1.default)(user);
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
}));
exports.signOut = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
exports.authPersist = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) {
        res.status(200).json({
            success: true,
            data: req.user,
            message: "User fetched Successfully !",
        });
    }
}));
exports.getUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new errorHandler_1.default(400, "User ID is required");
    }
    const user = yield db_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!user) {
        throw new errorHandler_1.default(404, "User not found");
    }
    res.status(200).json({
        success: true,
        message: "User found",
        data: user,
    });
}));
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
exports.getAllUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.default.user.findMany();
    res.status(200).json({
        success: true,
        message: "Users found",
        data: users,
    });
}));
