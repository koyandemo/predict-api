import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../lib/responseUtils";
import prisma from "../../prisma";

export async function getSeasonsController(req: Request, res: Response) {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: {
        created_at: "asc",
      },
    });
    return successResponse(res, "Seasons fetched successfully", seasons, 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch matches", error.message, 500);
  }
}
