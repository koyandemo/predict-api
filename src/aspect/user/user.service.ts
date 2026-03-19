import { getUserInfoFromGoogleProvider } from "../../lib/googleProviderUtils";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../../lib/userUtils";
import prisma from "../../prisma";
import {
  AuthUserResponseT,
  PrismaUserSelect,
  UserT,
} from "../../types/user.type";

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
      select: PrismaUserSelect,
    });

    const token = generateToken(newUser as UserT);

    return {
      success: true,
      message: "User registered successfully",
      token,
      user: newUser as UserT,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to register user",
      error: error.message,
    };
  }
}

export async function updateUserService(
  userId: number,
  userData: Partial<
    Pick<UserT, "name" | "avatar_url" | "avatar_bg_color" | "team_id">
  >
) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(userData.name && { name: userData.name }),
        ...(userData.avatar_url !== undefined && {
          avatar_url: userData.avatar_url,
        }),
        ...(userData.avatar_bg_color !== undefined && {
          avatar_bg_color: userData.avatar_bg_color,
        }),
        ...(userData.team_id !== undefined && {
          team_id: userData.team_id,
        }),
      },
      select: PrismaUserSelect,
    });

    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser as UserT,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update user",
      error: error.message,
    };
  }
}

export async function registerWithProviderService({
  accessToken,
  provider,
  providerAccountId,
}: {
  accessToken: string;
  provider: string;
  providerAccountId: string;
}): Promise<{ user: UserT; isNewUser: boolean }> {
  const { email, name, profile, providerIdFromToken } =
    await getUserInfoFromGoogleProvider(provider, accessToken);

  if (providerIdFromToken !== providerAccountId) {
    throw new Error("Provider account ID mismatch");
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return {
      user: user as UserT,
      isNewUser: false,
    };
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      provider,
      avatar_url: profile ?? "",
      role: "USER",
    },
    select: PrismaUserSelect,
  });

  return {
    user: newUser as UserT,
    isNewUser: true,
  };
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
