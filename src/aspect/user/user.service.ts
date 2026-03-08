import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../../lib/userUtils";
import prisma from "../../prisma";
import { AuthUserResponseT, UserT } from "@/types/user.type";

export async function registerUserService(
  userData: Omit<UserT, "id" | "created_at" | "updated_at">
): Promise<AuthUserResponseT> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      const { password, ...userWithoutPassword } = existingUser;

      const token = generateToken(userWithoutPassword as UserT);

      return {
        success: true,
        message: "User already exists",
        token,
        user: userWithoutPassword as UserT,
      };
    }

    let hashedPassword: string | undefined;

    if (userData.provider === "email" && userData.password) {
      hashedPassword = await hashPassword(userData.password);
    }

    if (userData.provider !== "email") {
      hashedPassword = undefined;
    }

    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        provider: userData.provider,
        role: userData.role as "ADMIN" | "USER",
        avatar_url: userData?.avatar_url || "",
        avatar_bg_color: userData.avatar_bg_color || "",
        team_id: userData.team_id,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = newUser;

    const token = generateToken(userWithoutPassword as UserT);

    return {
      success: true,
      message: "User registered successfully",
      token,
      user: userWithoutPassword as UserT,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to register user",
      error: error.message,
    };
  }
}

export async function loginUserService(
  email: string,
  password: string
): Promise<AuthUserResponseT> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        provider: "email",
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
        error: "INVALID_CREDENTIALS",
      };
    }

    if (!user.password) {
      return {
        success: false,
        message: "Invalid email or password",
        error: "INVALID_CREDENTIALS",
      };
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
        error: "INVALID_CREDENTIALS",
      };
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = generateToken(userWithoutPassword as UserT);

    return {
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword as UserT,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to login",
      error: error.message,
    };
  }
}
