import api from "./api";
import type { UserRegisterData, User } from "../interfaces/user";

export const userService = {
  register: async (userData: UserRegisterData): Promise<User> => {
    const response = await api.post<User>("/users", userData);
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },
};
