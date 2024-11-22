import { z } from "zod";

// Enums
const RoleEnum = z.enum(["CUSTOMER", "ADMIN", "VENDOR"]);
const OrderStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);
const SizeEnum = z.enum(["XS", "S", "N", "M", "L", "XL", "XXL"]);
const GenderEnum = z.enum(["MEN", "WOMEN", "UNISEX"]);

// Models

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: RoleEnum.default("CUSTOMER"),
  avatar: z.string().url().nullable(),
  address: z.string().nullable(),
  wishlist: z.array(z.lazy(() => ProductSchema)), // Recursive reference
  cart: z.array(z.lazy(() => CartItemSchema)),
  orders: z.array(z.lazy(() => OrderSchema)),
  reviews: z.array(z.lazy(() => ReviewSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
  Vendor: z.array(z.lazy(() => VendorSchema)),
});

const VendorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  logo: z.string().url().nullable(),
  products: z.array(z.lazy(() => ProductSchema)),
  orders: z.array(z.lazy(() => OrderSchema)),
  userId: z.string().uuid(),
  user: z.lazy(() => UserSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createShopSchema = z.object({
  name: z.string().min(3, "Shop Name is required"),
  description: z.string().nullable(),
  logo: z.string().min(0).nullable().optional(),
  userId: z.string(),
});

const CartItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  product: z.lazy(() => ProductSchema),
  quantity: z.number().int().min(1),
  userId: z.string().uuid(),
  user: z.lazy(() => UserSchema),
});

const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  iconUrl: z.string().url().nullable(),
  iconPublicId: z.string().nullable(),
  products: z.array(z.lazy(() => ProductSchema)),
  parentId: z.string().uuid().nullable(),
  parent: z.lazy(() => CategorySchema).nullable(),
  childrens: z.array(z.lazy(() => CategorySchema)),
  brands: z.array(z.lazy(() => BrandSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ImageSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  publicId: z.string(),
  productId: z.string().uuid(),
  product: z.lazy(() => ProductSchema),
});

const ColorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  productId: z.string().uuid(),
  product: z.lazy(() => ProductSchema),
});

const SizeSchema = z.object({
  id: z.string().uuid(),
  value: SizeEnum,
  productId: z.string().uuid(),
  product: z.lazy(() => ProductSchema),
});

const OrderSchema = z.object({
  id: z.string().uuid(),
  products: z.array(z.lazy(() => OrderItemSchema)),
  userId: z.string().uuid(),
  user: z.lazy(() => UserSchema),
  vendorId: z.string().uuid(),
  vendor: z.lazy(() => VendorSchema),
  address: z.string(),
  phone: z.string(),
  totalPrice: z.number(),
  orderStatus: OrderStatusEnum.default("PENDING"),
  deliveredAt: z.date().nullable(),
  paidAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const OrderItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  product: z.lazy(() => ProductSchema),
  quantity: z.number().int().min(1),
  color: z.string().nullable(),
  size: z.string().nullable(),
  orderId: z.string().uuid(),
  order: z.lazy(() => OrderSchema),
});

const ReviewSchema = z.object({
  id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  userId: z.string().uuid(),
  user: z.lazy(() => UserSchema),
  productId: z.string().uuid(),
  product: z.lazy(() => ProductSchema),
});

const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  categoryId: z.string().uuid(),
  category: z.lazy(() => CategorySchema),
  images: z.array(z.lazy(() => ImageSchema)),
  colors: z.array(z.lazy(() => ColorSchema)),
  sizes: z.array(z.lazy(() => SizeSchema)),
  brandId: z.string().uuid(),
  brand: z.lazy(() => BrandSchema),
  stock: z.number().int(),
  sold: z.number().int().default(0),
  rating: z.number().default(0),
  reviews: z.array(z.lazy(() => ReviewSchema)),
  material: z.string().nullable(),
  style: z.string().nullable(),
  gender: GenderEnum.default("UNISEX"),
  releaseDate: z.date().nullable(),
  limitedEdition: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  vendorId: z.string().uuid(),
  vendor: z.lazy(() => VendorSchema),
  CartItem: z.array(z.lazy(() => CartItemSchema)),
  OrderItem: z.array(z.lazy(() => OrderItemSchema)),
  userId: z.string().uuid().nullable(),
  User: z.lazy(() => UserSchema).nullable(),
});

const BrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  products: z.array(z.lazy(() => ProductSchema)),
  categoryId: z.string().uuid().nullable(),
  Category: z.lazy(() => CategorySchema).nullable(),
});
