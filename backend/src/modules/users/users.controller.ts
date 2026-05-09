import { Request, Response } from "express";
import * as service from "./users.service";

export const create = async (req: Request, res: Response) => {
  const user = await service.create(req.body);
  return res.status(201).json(user);
};

export const list = async (req: Request, res: Response) => {
  const users = await service.listAll();
  return res.status(200).json(users);
};
