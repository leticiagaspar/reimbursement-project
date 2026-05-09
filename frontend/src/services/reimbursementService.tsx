import api from "./api";
import type {
  Reimbursement,
  History,
  Attachment,
} from "../interfaces/reimbursement";
import type { Status } from "../interfaces/enum";

export const ReimbursementService = {
  list: async (params?: {
    status?: Status;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<Reimbursement[]>("/reimbursements", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Reimbursement>(`/reimbursements/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<
      Reimbursement,
      "id" | "status" | "createdAt" | "updatedAt" | "userId"
    >,
  ) => {
    const response = await api.post<Reimbursement>("/reimbursements", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Reimbursement>) => {
    const response = await api.put<Reimbursement>(
      `/reimbursements/${id}`,
      data,
    );
    return response.data;
  },

  submit: async (id: string) => {
    const response = await api.post<Reimbursement>(
      `/reimbursements/${id}/submit`,
    );
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.post<Reimbursement>(
      `/reimbursements/${id}/cancel`,
    );
    return response.data;
  },

  approve: async (id: string) => {
    const response = await api.post<Reimbursement>(
      `/reimbursements/${id}/approve`,
    );
    return response.data;
  },

  reject: async (id: string, rejectionReason: string) => {
    const response = await api.post<Reimbursement>(
      `/reimbursements/${id}/reject`,
      {
        rejectionReason,
      },
    );
    return response.data;
  },

  pay: async (id: string) => {
    const response = await api.post<Reimbursement>(`/reimbursements/${id}/pay`);
    return response.data;
  },

  getHistory: async (id: string) => {
    const response = await api.get<History[]>(`/reimbursements/${id}/history`);
    return response.data;
  },

  getAttachments: async (id: string) => {
    const response = await api.get<Attachment[]>(
      `/reimbursements/${id}/attachments`,
    );
    return response.data;
  },

  uploadAttachment: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<Attachment>(
      `/reimbursements/${id}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
