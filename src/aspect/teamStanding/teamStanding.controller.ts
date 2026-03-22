import { errorResponse, successResponse } from "../../lib/responseUtils";
import { Request, Response } from "express";
import prisma from "../../prisma";

export async function createTeamStandingController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      team_id,
      league_season_id,
      played,
      won,
      drawn,
      lost,
      goals_for,
      goals_against,
      goal_difference,
      points,
    } = req.body;

    const data = await prisma.teamStanding.create({
      data: {
        team_id,
        league_season_id,
        played: played ?? 0,
        won: won ?? 0,
        drawn: drawn ?? 0,
        lost: lost ?? 0,
        goals_for: goals_for ?? 0,
        goals_against: goals_against ?? 0,
        goal_difference: goal_difference ?? 0,
        points: points ?? 0,
      },
    });

    return successResponse(res, "Team standing created", data, 201);
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to create team standing",
      error.message,
      500
    );
  }
}

export async function getTeamStandingsController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { league_season_id } = req.query;

    const data = await prisma.teamStanding.findMany({
      where: {
        league_season_id: Number(league_season_id),
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            logo_url: true,
            short_code: true,
            group_name: true,
          },
        },
      },
      orderBy: [
        { points: "desc" },
        { goal_difference: "desc" },
        { goals_for: "desc" },
      ],
    });

    return successResponse(res, "Fetched team standings", data, 200);
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch standings", error.message, 500);
  }
}

export async function getTeamStandingByIdController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const data = await prisma.teamStanding.findUnique({
      where: { id: Number(id) },
      include: {
        team: true,
        league_season: true,
      },
    });

    if (!data) {
      return errorResponse(res, "Team standing not found", "", 404);
    }

    return successResponse(res, "Fetched team standing", data, 200);
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to fetch team standing",
      error.message,
      500
    );
  }
}

export async function updateTeamStandingController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const {
      played,
      won,
      drawn,
      lost,
      goals_for,
      goals_against,
      goal_difference,
      points,
    } = req.body;

    const data = await prisma.teamStanding.update({
      where: { id: Number(id) },
      data: {
        played,
        won,
        drawn,
        lost,
        goals_for,
        goals_against,
        goal_difference,
        points,
      },
    });

    return successResponse(res, "Team standing updated", data, 200);
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to update team standing",
      error.message,
      500
    );
  }
}

export async function deleteTeamStandingController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    await prisma.teamStanding.delete({
      where: { id: Number(id) },
    });

    return successResponse(res, "Team standing deleted", null, 200);
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to delete team standing",
      error.message,
      500
    );
  }
}
