import { UserT } from "../types/user.type";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(user: Omit<UserT, "password">): string {
  // Create payload without password
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    role: user.role,
    avatar_url: user?.avatar_url || "",
    avatar_bg_color: user?.avatar_bg_color || "",
    team_id: user.team_id,
  };

  // Use a secret key from environment variables
  const secret = process.env.JWT_SECRET || "predict@ocean@2026!!!14670";
  const expiresIn = process.env.JWT_EXPIRES_IN || "61d";

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}
