export interface UserT {
  id: number;
  name: string;
  email: string;
  provider: "email" | "google" | string;
  password?: string;
  role: "ADMIN" | "USER" | "SEED";
  avatar_url?: string | "";
  avatar_bg_color?: string | "";
  created_at: Date;
  updated_at: Date;
  team_id: number;
}

export interface AuthUserResponseT {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<UserT, "password">;
  error?: string;
}

export const PrismaUserSelect = {
  id: true,
  name: true,
  email: true,
  provider: true,
  role: true,
  avatar_url: true,
  avatar_bg_color: true,
  created_at: true,
  updated_at: true,
  team_id: true,
};
