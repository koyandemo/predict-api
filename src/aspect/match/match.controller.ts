import { Request, Response } from "express";
import prisma from "../../prisma";
import { errorResponse, successResponse } from "../../lib/responseUtils";
import { MatchT } from "../../types/match.type";

/**
 * Create Match
 */
export async function createMatchController(req: Request, res: Response) {
  try {
    const {
      kickoff,
      timezone,
      venue,
      status,
      slug,
      allow_draw,
      big_match,
      derby,
      type,
      home_score,
      away_score,
      published,
      home_team_id,
      away_team_id,
      league_id,
    }: Omit<MatchT, "id"> & { timezone: string } = req.body;

    if (
      !kickoff ||
      !venue ||
      !slug ||
      !home_team_id ||
      !away_team_id ||
      !league_id
    ) {
      return errorResponse(res, "Required fields are missing", "", 400);
    }

    const existingMatch = await prisma.match.findUnique({
      where: { slug },
    });

    if (existingMatch) {
      return errorResponse(res, "Match slug already exists", "", 400);
    }

    const match = await prisma.match.create({
      data: {
        kickoff: new Date(kickoff),
        timezone,
        venue,
        status,
        slug,
        allow_draw,
        big_match,
        derby,
        type,
        home_score,
        away_score,
        published,
        home_team_id,
        away_team_id,
        league_id,
      },
    });

    return successResponse(res, "Match created successfully", match, 201);
  } catch (error: any) {
    return errorResponse(res, "Failed to create Match", error.message, 500);
  }
}

/**
 * Get All Matches
 */
export async function getMatchesController(req: Request, res: Response) {
  try {
    const {
      league,
      status,
      type,
      published,
      team,
      from,
      to,
      search,
      page = "1",
      limit = "10",
    } = req.query;

    const where: any = {};

    // league filter
    if (league) {
      where.league_id = Number(league);
    }

    // status filter
    if (status) {
      where.status = status;
    }

    // type filter
    if (type) {
      where.type = type;
    }

    // published filter
    if (published !== undefined) {
      where.published = published === "true";
    }

    // team filter (home or away)
    if (team) {
      where.OR = [
        { home_team_id: Number(team) },
        { away_team_id: Number(team) },
      ];
    }

    // date range filter
    if (from || to) {
      where.kickoff = {};

      if (from) {
        where.kickoff.gte = new Date(from as string);
      }

      if (to) {
        where.kickoff.lte = new Date(to as string);
      }
    }

    // search filter
    if (search) {
      where.OR = [
        {
          home_team: {
            name: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        },
        {
          away_team: {
            name: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        },
        {
          venue: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ];
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const matches = await prisma.match.findMany({
      where,
      include: {
        home_team: true,
        away_team: true,
        league: true,
      },
      orderBy: {
        kickoff: "asc",
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const total = await prisma.match.count({ where });

    return successResponse(res, "Matches fetched successfully", {
      data: matches,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        total_pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch matches", error.message, 500);
  }
}

/**
 * Get Match By Slug
 */
export async function getMatchBySlugController(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const match = await prisma.match.findUnique({
      where: { slug: slug as string },
      include: {
        home_team: true,
        away_team: true,
        league: true,
      },
    });

    if (!match) {
      return errorResponse(res, "Match not found", "", 404);
    }

    return successResponse(res, "Match fetched successfully", match);
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch match", error.message, 500);
  }
}

/**
 * Update Match
 */
export async function updateMatchController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const match = await prisma.match.update({
      where: { id: Number(id) },
      data: req.body,
    });

    return successResponse(res, "Match updated successfully", match);
  } catch (error: any) {
    return errorResponse(res, "Failed to update match", error.message, 500);
  }
}

/**
 * Delete Match
 */
export async function deleteMatchController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.match.delete({
      where: { id: Number(id) },
    });

    return successResponse(res, "Match deleted successfully", null);
  } catch (error: any) {
    return errorResponse(res, "Failed to delete match", error.message, 500);
  }
}

/**
 * Vote Match
 */
export async function voteMatchController(req: Request, res: Response) {
  try {
    // const userId = req.user.id; // from auth middleware
    const userId = 1;
    const matchId = Number(req.params.id);
    const { vote } = req.body;

    if (!vote) {
      return errorResponse(res, "Vote option is required", "", 400);
    }

    const existingVote = await prisma.matchVote.findUnique({
      where: {
        user_id_match_id: {
          user_id: userId,
          match_id: matchId,
        },
      },
    });

    let result;

    if (existingVote) {
      result = await prisma.matchVote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          vote,
        },
      });
    } else {
      result = await prisma.matchVote.create({
        data: {
          user_id: userId,
          match_id: matchId,
          vote,
        },
      });
    }

    return successResponse(res, "Vote submitted successfully", result);
  } catch (error: any) {
    return errorResponse(res, "Failed to submit vote", error.message, 500);
  }
}

/**
 * Get Match Votes
 */

export async function getMatchVotesController(req: Request, res: Response) {
  try {
    const matchId = Number(req.params.id);

    const votes = await prisma.matchVote.groupBy({
      by: ["vote"],
      where: { match_id: matchId },
      _count: true,
    });

    let home = 0;
    let draw = 0;
    let away = 0;

    votes.forEach((v) => {
      if (v.vote === "HOME") home = v._count;
      if (v.vote === "DRAW") draw = v._count;
      if (v.vote === "AWAY") away = v._count;
    });

    const total = home + draw + away;

    const percent = (n: number) =>
      total === 0 ? 0 : Number(((n / total) * 100).toFixed(2));

    return successResponse(res, "Vote results fetched", {
      home: { votes: home, percent: percent(home) },
      draw: { votes: draw, percent: percent(draw) },
      away: { votes: away, percent: percent(away) },
      total_votes: total,
    });
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch votes", error.message, 500);
  }
}

/**
 * Create Score Option
 */

export async function createScoreOptionController(req: Request, res: Response) {
  try {
    const matchId = Number(req.params.id);
    const { home_score, away_score } = req.body;

    const option = await prisma.scoreOption.create({
      data: {
        match_id: matchId,
        home_score,
        away_score,
      },
    });

    return successResponse(res, "Score option created", option);
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to create score option",
      error.message,
      500
    );
  }
}

/**
 * Get Score Option
 */

export async function getScoreOptionsController(req: Request, res: Response) {
  try {
    const matchId = Number(req.params.id);

    const options = await prisma.scoreOption.findMany({
      where: { match_id: matchId },
      orderBy: {
        created_at: "asc",
      },
    });

    return successResponse(res, "Score options fetched", options);
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to fetch score options",
      error.message,
      500
    );
  }
}

/**
 * Update Score Option
 */

export async function updateScoreOptionController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { home_score, away_score } = req.body;

    const option = await prisma.scoreOption.update({
      where: { id },
      data: {
        home_score,
        away_score,
      },
    });

    return successResponse(res, "Score option updated", option);
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to update score option",
      error.message,
      500
    );
  }
}

/**
 * Delete Score Option
 */

export async function deleteScoreOptionController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await prisma.scoreOption.delete({
      where: { id },
    });

    return successResponse(res, "Score option deleted", null);
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to delete score option",
      error.message,
      500
    );
  }
}

/**
 * Vote Score Option
 */

export async function voteScorePredictionController(
  req: Request,
  res: Response
) {
  try {
    const userId = 3;
    const matchId = Number(req.params.id);
    const { score_option_id } = req.body;

    const existing = await prisma.scorePrediction.findUnique({
      where: {
        user_id_match_id: {
          user_id: userId,
          match_id: matchId,
        },
      },
    });

    let prediction;

    if (existing) {
      prediction = await prisma.scorePrediction.update({
        where: { id: existing.id },
        data: { score_option_id },
      });
    } else {
      prediction = await prisma.scorePrediction.create({
        data: {
          user_id: userId,
          match_id: matchId,
          score_option_id,
        },
      });
    }

    return successResponse(res, "Prediction submitted", prediction);
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to submit prediction",
      error.message,
      500
    );
  }
}


/**
 * Get Prediction Results
 */

export async function getPredictionResultsController(req: Request, res: Response) {
  try {
    const matchId = Number(req.params.id);

    const options = await prisma.scoreOption.findMany({
      where: { match_id: matchId },
      include: {
        _count: {
          select: { votes: true }
        }
      }
    });

    const totalVotes = options.reduce((sum, o) => sum + o._count.votes, 0);

    const results = options.map(o => ({
      id: o.id,
      home_score: o.home_score,
      away_score: o.away_score,
      votes: o._count.votes,
      percent: totalVotes === 0 ? 0 :
        Math.round((o._count.votes / totalVotes) * 100)
    }));

    return successResponse(res, "Prediction results fetched", {
      total_votes: totalVotes,
      predictions: results
    });

  } catch (error: any) {
    return errorResponse(res, "Failed to fetch predictions", error.message, 500);
  }
}