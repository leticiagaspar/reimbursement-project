import { Request, Response } from "express";
import { z } from "zod";
import * as reimbursementService from "./reimbursements.service";
import {
  createReimbursementSchema,
  updateReimbursementSchema,
  rejectReimbursementSchema,
  listReimbursementsQuerySchema,
} from "./reimbursements.schema";

const idSchema = z.uuid("ID da solicitação inválido.");

export const create = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = createReimbursementSchema.parse(req.body);
  const result = await reimbursementService.create(userId, data);
  res.status(201).json(result);
};

export const list = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;

  const filters = listReimbursementsQuerySchema.parse(req.query);

  const result = await reimbursementService.list(userId, role, filters);
  res.json(result);
};

export const getById = async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const result = await reimbursementService.findById(
    id,
    req.user!.id,
    req.user!.role,
  );
  res.json(result);
};

export const getHistory = async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const result = await reimbursementService.getHistory(
    id,
    req.user!.id,
    req.user!.role,
  );
  res.json(result);
};

export const update = async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const data = updateReimbursementSchema.parse(req.body);
  const result = await reimbursementService.update(id, req.user!.id, data);
  res.json(result);
};

export const submit = async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const result = await reimbursementService.submit(id, req.user!.id);
  res.json(result);
};

export const cancel = async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const result = await reimbursementService.cancel(id, req.user!.id);
  res.json(result);
};

export const approve = async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const result = await reimbursementService.approve(id, req.user!.id);
  res.json(result);
};

export const reject = async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const { rejectionReason } = rejectReimbursementSchema.parse(req.body);
  const result = await reimbursementService.reject(
    id,
    req.user!.id,
    rejectionReason,
  );
  res.json(result);
};

export const pay = async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const result = await reimbursementService.pay(id, req.user!.id);
  res.json(result);
};
