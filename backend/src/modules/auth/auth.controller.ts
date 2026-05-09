import { Request, Response } from "express";
import * as authService from "./auth.service";
import { loginSchema } from "./auth.schema";

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsedData = loginSchema.parse(req.body); 
  const result = await authService.login(parsedData);
  res.status(200).json(result);
};

