export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "user";
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
