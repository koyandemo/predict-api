import { errorResponse, successResponse } from "../../lib/responseUtils";
import prisma from "../../prisma";
import { TeamT } from "../../types/team.type";
import { Request, Response } from "express";
import slugify from "slugify";

/**
 * Create Team (League Required)
 */
export async function createTeamController(
  req: Request,
  res: Response
): Promise<Response<TeamT>> {
  try {
    const { name, short_code, logo_url, country, venue, type, league_id } =
      req.body;

    if (!name || !short_code || !league_id || !venue) {
      return errorResponse(
        res,
        "name, short_code, venue and league_id are required",
        "",
        400
      );
    }

    // check league exists
    const league = await prisma.league.findUnique({
      where: { id: Number(league_id) },
    });

    if (!league) {
      return errorResponse(res, "League not found", "", 404);
    }

    // generate slug from team name
    let slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // check duplicate slug
    let existingTeam = await prisma.team.findUnique({
      where: { slug },
    });

    let counter = 1;
    while (existingTeam) {
      slug = `${slug}-${counter}`;
      existingTeam = await prisma.team.findUnique({
        where: { slug },
      });
      counter++;
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
        league_id: Number(league_id),
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
export async function getTeamsController(
  req: Request,
  res: Response
): Promise<Response<TeamT[]>> {
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
export async function getTeamByIdController(
  req: Request,
  res: Response
): Promise<Response<TeamT>> {
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
export async function updateTeamController(
  req: Request,
  res: Response
): Promise<Response<TeamT>> {
  try {
    const { id } = req.params;
    const data: Omit<TeamT, "league"> = req.body;

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
export async function deleteTeamController(
  req: Request,
  res: Response
): Promise<Response> {
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

/**
 * Get Teams by Vote (for World Cup Voting Page)
 * Returns all teams with their vote statistics, sorted by total votes
 */
export async function getTeamsByVoteController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { leagueSeasonId } = req.params;

    // Fetch all teams with their vote data
    const teams = await prisma.team.findMany({
      include: {
        league: true,
        winner_votes: leagueSeasonId
          ? {
              where: {
                league_season_id: Number(leagueSeasonId),
              },
            }
          : true,
        admin_winner_votes: leagueSeasonId
          ? {
              where: {
                league_season_id: Number(leagueSeasonId),
              },
            }
          : true,
      },
    });

    // Calculate vote statistics for each team
    const teamsWithVotes = teams.map((team) => {
      const userVotesCount = team.winner_votes?.length || 0;
      const adminVotesCount =
        team.admin_winner_votes?.reduce(
          (sum, vote) => sum + vote.vote_count,
          0
        ) || 0;
      const totalVotes = userVotesCount + adminVotesCount;
      return {
        id: team.id,
        name: team.name,
        slug: team.slug,
        short_code: team.short_code,
        logo_url: team.logo_url,
        country: team.country,
        type: team.type,
        venue: team.venue,
        league_id: team.league_id,
        league: team.league,
        group_name: team.group_name,
        ranking: team.ranking,
        participations: team.participations,
        continental: team.continental,
        isHost: team.isHost,
        total_votes: totalVotes,
      };
    });

    teamsWithVotes.sort((a, b) => b.total_votes - a.total_votes);

    return successResponse(
      res,
      "Teams with votes fetched successfully",
      teamsWithVotes,
      200
    );
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to fetch teams with votes",
      error.message,
      500
    );
  }
}
