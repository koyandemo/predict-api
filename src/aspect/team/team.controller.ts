import { errorResponse, successResponse } from "../../lib/responseUtils";
import prisma from "../../prisma";
import { TeamT } from "../../types/team.type";
import { Request, Response } from "express";

/**
 * Create Team (League Required)
 */
export async function createTeamController(req: Request, res: Response) {
  try {
    const {
      name,
      slug,
      short_code,
      logo_url,
      country,
      venue,
      type,
      league_id,
    }: TeamT = req.body;

    if (!name || !slug || !short_code || !league_id || !venue) {
      return errorResponse(
        res,
        "name, slug, short_code, venue and league_id are required",
        "",
        404
      );
    }

    // check league exists
    const league = await prisma.league.findUnique({
      where: { id: Number(league_id) },
    });

    if (!league) {
      return errorResponse(res, "League not found", "", 404);
    }

    // check duplicate slug
    const existingTeam = await prisma.team.findUnique({
      where: { slug },
    });

    if (existingTeam) {
      return errorResponse(res, "Team slug already exists", "", 400);
    }

    const team = await prisma.team.create({
      data: {
        name,
        slug,
        short_code,
        logo_url,
        country,
        type,
        venue,
        league_id,
      },
      include: {
        league: true,
      },
    });

    return successResponse(res, "Team created successfully", team, 201);
  } catch (error: any) {
    return errorResponse(res, "Failed to create team", error.message, 500);
  }
}

/**
 * Get All Teams
 */
export async function getTeamsController(req: Request, res: Response) {
  try {
    const teams = await prisma.team.findMany({
      include: {
        league: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return successResponse(res, "Teams fetched successfully", teams, 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch teams", error.message, 500);
  }
}

/**
 * Get Team By ID
 */
export async function getTeamByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const team = await prisma.team.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        league: true,
      },
    });

    if (!team) {
      return errorResponse(res, "Team not found", "", 404);
    }

    return successResponse(res, "Team fetched successfully", team, 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch team", error.message, 500);
  }
}

/**
 * Update Team
 */
export async function updateTeamController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data: TeamT = req.body;

    if (data.league_id) {
      const league = await prisma.league.findUnique({
        where: { id: data.league_id },
      });

      if (!league) {
        return res.status(404).json({
          success: false,
          message: "League not found",
        });
      }
    }

    const team = await prisma.team.update({
      where: {
        id: Number(id),
      },
      data,
      include: {
        league: true,
      },
    });

    return successResponse(res, "Team updated successfully", team, 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to update team", error.message, 500);
  }
}

/**
 * Delete Team
 */
export async function deleteTeamController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.team.delete({
      where: {
        id: Number(id),
      },
    });
    return successResponse(res, "Team deleted successfully", "", 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to delete team", error.message, 500);
  }
}
