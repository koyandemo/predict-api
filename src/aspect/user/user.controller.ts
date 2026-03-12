import { Request, Response } from "express";
import {
  loginUserService,
  registerUserService,
  registerWithProviderService,
  updateUserService,
} from "./user.service";
import { errorResponse, successResponse } from "../../lib/responseUtils";
import { UserT } from "@/types/user.type";
import { generateToken } from "../../lib/userUtils";

export async function registerUserController(
  req: Request,
  res: Response
): Promise<Response<UserT>> {
  try {
    const {
      name,
      email,
      password,
      provider = "email",
      role = "USER",
      avatar_url,
      avatar_bg_color,
      team_id,
    } = req.body;

    if (!name || !email) {
      return errorResponse(res, "Name and email are required", "", 400);
    }

    if (provider === "email" && !password) {
      return errorResponse(
        res,
        "Password is required for email registration",
        "",
        400
      );
    }

    const result = await registerUserService({
      name,
      email,
      password,
      provider,
      role,
      avatar_url,
      avatar_bg_color,
      team_id,
    });

    if (!result.success) {
      return errorResponse(res, result.message, result.error, 400);
    }

    return successResponse(
      res,
      result.message,
      {
        token: result.token,
        user: result.user,
      },
      201
    );
  } catch (error: any) {
    return errorResponse(
      res,
      "Internal server error during registration",
      error.message,
      500
    );
  }
}

export async function updateUserProfileController(
  req: Request,
  res: Response
): Promise<Response<UserT>> {
  try {
    const { name, avatar_url, avatar_bg_color, team_id } = req.body;

    const userId = req.user?.id; // assuming auth middleware attaches user

    if (!userId) {
      return errorResponse(res, "Unauthorized", "", 401);
    }

    if (!name && !avatar_url && !avatar_bg_color && team_id === undefined) {
      return errorResponse(res, "No fields provided for update", "", 400);
    }

    const result = await updateUserService(userId, {
      name,
      avatar_url,
      avatar_bg_color,
      team_id,
    });

    if (!result.success) {
      return errorResponse(res, result.message, result.error, 400);
    }

    return successResponse(res, result.message, result.user, 200);
  } catch (error: any) {
    return errorResponse(
      res,
      "Internal server error during user update",
      error.message,
      500
    );
  }
}

export async function registerWithProviderController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { accessToken, provider, providerAccountId } = req.body;

    if (!accessToken || !provider || !providerAccountId) {
      return errorResponse(
        res,
        "accessToken, provider and providerAccountId are required",
        "",
        400
      );
    }

    const result = await registerWithProviderService({
      accessToken,
      provider,
      providerAccountId,
    });

    const token = generateToken(result.user);

    return successResponse(
      res,
      result.isNewUser
        ? "User registered successfully"
        : "User logged in successfully",
      {
        token,
        user: result.user,
      },
      result.isNewUser ? 201 : 200
    );
  } catch (error: any) {
    return errorResponse(
      res,
      "Internal server error during provider authentication",
      error.message,
      500
    );
  }
}

export async function loginUserController(
  req: Request,
  res: Response
): Promise<Response<UserT>> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", "", 400);
    }

    const result = await loginUserService(email, password);

    if (!result.success) {
      return errorResponse(res, result.message, result.error, 403);
    }

    return successResponse(
      res,
      result.message,
      {
        token: result.token,
        user: result.user,
      },
      200
    );
  } catch (error: any) {
    return errorResponse(
      res,
      "Internal server error during login",
      error.message,
      500
    );
  }
}
