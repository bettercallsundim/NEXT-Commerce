"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const request_ip_1 = __importDefault(require("request-ip"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const vendor_route_1 = __importDefault(require("./routes/vendor.route"));
// import redis from "./config/redis";
const errorHandler_1 = __importStar(require("./utils/errorHandler"));
const app = (0, express_1.default)();
dotenv.config();
// redis
//   .connect()
//   .then(() => {
//     console.log("Redis connected");
//   })
//   .catch((err) => {
//     console.log("Redis connection failed", err);
//   });
//middlewares
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND],
    credentials: true,
}));
app.use(request_ip_1.default.mw());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, compression_1.default)());
app.use("/uploads", express_1.default.static("uploads"));
app.disable("x-powered-by");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//routes
app.use("/api/v1/user", user_route_1.default);
app.use("/api/v1/vendor", vendor_route_1.default);
app.use("/api/v1/category", category_route_1.default);
app.use("*", (req, res, next) => {
    throw new errorHandler_1.default(400, "Route does not exists");
});
app.use(errorHandler_1.errorHandler);
//start server
app.listen(4000, () => {
    console.log("Server started");
});
