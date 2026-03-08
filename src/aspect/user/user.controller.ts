import { Request, Response } from "express";
import { loginUserService, registerUserService } from "./user.service";
import { errorResponse, successResponse } from "../../lib/responseUtils";

export async function registerUserController(req: Request, res: Response) {
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

export async function loginUserController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", "", 400);
    }

    const result = await loginUserService(email, password);

    if (!result.success) {
      return errorResponse(res, result.message, result.error, 401);
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
