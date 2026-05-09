import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Erro de validação dos dados.",
      error: "Bad Request",
      errors: z.treeifyError(error),
    });

    return;
  }

  console.error(`[Error] ${req.method} ${req.url} - `, error);

  res.status(500).json({
    message: "Erro interno no servidor.",
    error: "Internal Server Error",
  });
};
