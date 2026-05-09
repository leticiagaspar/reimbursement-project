import type { Action, Status } from "./enum";

export interface Reimbursement {
  id: string;
  description: string;
  value: number;
  status: Status;
  expenseDate: string;
  rejectionReason?: string;
  category: { id: string; name: string };
  user: { id: string; name: string; email: string };
  attachments: Attachment[];
  history: History[];
  createdAt: string;
  updatedAt: string;
}

export interface ListReimbursementsQuery {
  status?: Status;
  categoryId?: string;
  search?: string;
  sort?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface History {
  id: string;
  reimbursementId: string;
  userId: string;
  action: Action;
  observation?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  url: string;
  fileType: string;
}
