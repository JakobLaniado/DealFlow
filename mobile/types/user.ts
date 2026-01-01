export type UserRole = "client" | "seller"

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
    user: User;
    token: string;
}
