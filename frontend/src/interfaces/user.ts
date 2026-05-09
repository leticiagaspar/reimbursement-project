import type { Role } from "./enum";

export interface UserRegisterData {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
