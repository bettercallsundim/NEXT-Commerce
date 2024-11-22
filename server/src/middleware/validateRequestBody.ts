import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import OhError from "../utils/errorHandler";

const validateRequestBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      throw new OhError(400, "Error Validation");
    }

    req.body = result.data;
    next();
  };

export default validateRequestBody;
