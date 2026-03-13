import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../lib/responseUtils";
import prisma from "../../prisma";

export async function getGameWeeksController(req: Request, res: Response) {
  try {
    const gameWeeks = await prisma.gameWeek.findMany({
      orderBy: {
        created_at: "asc",
      },
    });
    return successResponse(res, "Game Week fetched successfully", gameWeeks, 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch matches", error.message, 500);
  }
}
