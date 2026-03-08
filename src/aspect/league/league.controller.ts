import { errorResponse, successResponse } from "../../lib/responseUtils";
import prisma from "../../prisma";
import { LeagueT } from "../../types/league.type";
import { Request, Response } from "express";
import slugify from "slugify";

/**
 * Create League
 */
export async function createLeagueController(req: Request, res: Response) {
  try {
    const { name, country, logo_url, sort_order } = req.body;

    if (!name || !country) {
      return errorResponse(res, "Name and country are required", "", 400);
    }

    // Auto create slug
    const slug = slugify(`${name}-${country}`, {
      lower: true,
      strict: true,
      trim: true,
    });

    const existingLeague = await prisma.league.findUnique({
      where: { slug },
    });

    if (existingLeague) {
      return errorResponse(res, "League slug already exists", "", 400);
    }

    const league = await prisma.league.create({
      data: {
        name,
        country,
        slug,
        logo_url,
        sort_order: sort_order ?? 0,
      },
    });

    return successResponse(res, "League created successfully", league, 201);
  } catch (error: any) {
    return errorResponse(res, "Failed to create League", error.message, 500);
  }
}

/**
 * Get All Leagues
 */
export async function getLeaguesController(req: Request, res: Response) {
  try {
    const leagues = await prisma.league.findMany({
      include: {
        teams: true,
      },
      orderBy: {
        sort_order: "asc",
      },
    });
    return successResponse(res, "Leagues fetched successfully", leagues, 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch leagues", error.message, 500);
  }
}

/**
 * Get Single League
 */
export async function getLeagueByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const league = await prisma.league.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        teams: true,
      },
    });

    if (!league) {
      return errorResponse(res, "League not found", "", 404);
    }

    return successResponse(res, "League fetched successfully", league, 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch league", error.message, 500);
  }
}

/**
 * Update League
 */
export async function updateLeagueController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data: LeagueT = req.body;

    const league = await prisma.league.update({
      where: {
        id: Number(id),
      },
      data,
    });

    return successResponse(res, "League updated successfully", league, 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to update league", error.message, 500);
  }
}

/**
 * Delete League
 */
export async function deleteLeagueController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.league.delete({
      where: {
        id: Number(id),
      },
    });
    return successResponse(res, "League deleted successfully", "", 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to delete league", error.message, 500);
  }
}
