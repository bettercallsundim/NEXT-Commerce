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
exports.getAllVendorsByUser = exports.getAllVendors = exports.deleteVendor = exports.updateVendor = exports.createVendor = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
exports.createVendor = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // extract name, email and avatar from request body
    const { name, description } = req.body;
    let userId = req.user.id;
    if (!name || !userId) {
        throw new errorHandler_1.default(400, "All fields are required");
    }
    let vendor = yield db_1.default.vendor.create({
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
}));
exports.updateVendor = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, logo, id } = req.body;
    const vendor = yield db_1.default.vendor.update({
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
}));
exports.deleteVendor = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield db_1.default.vendor.delete({
        where: {
            id,
        },
    });
    res.status(200).json({
        success: true,
        message: "Vendor Deleted Successfully !",
    });
}));
exports.getAllVendors = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield db_1.default.vendor.findMany();
    res.status(200).json({
        success: true,
        data: vendors,
        message: "Vendors Fetched Successfully !",
    });
}));
exports.getAllVendorsByUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const vendors = yield db_1.default.vendor.findMany({
        where: {
            userId,
        },
    });
    res.status(200).json({
        success: true,
        data: vendors,
        message: "Vendors Fetched Successfully !",
    });
}));
