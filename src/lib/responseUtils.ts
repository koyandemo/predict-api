import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export function successResponse<T>(
  res: Response,
  message: string,
  data?: T,
  status = 200
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  message: string,
  error?: string,
  status = 500
) {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
}