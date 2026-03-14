import { Request, Response } from "express";
import prisma from "../../prisma";
import { errorResponse, successResponse } from "../../lib/responseUtils";
import {
  ApiResScorePredictionT,
  MatchT,
  MatchVoteResultT,
  MatchVoteT,
  ScoreOptionT,
  ScorePredictionT,
} from "../../types/match.type";
import { PaginationT } from "@/types/index.type";

/**
 * Create Match
 */
export async function createMatchController(
  req: Request,
  res: Response
): Promise<Response<MatchT>> {
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
      season_id,
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
        season_id
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
export async function getMatchesController(
  req: Request,
  res: Response
): Promise<Response<{ data: MatchT[]; pagination: PaginationT }>> {
  try {
    const {
      league_id,
      status,
      type,
      published,
      team,
      from,
      season_id,
      gameweek_id,
      group_name,
      to,
      search,
      page = "1",
      limit = "100",
    } = req.query;

    const where: any = {};

    // league filter
    if (league_id) {
      where.league_id = Number(league_id);
    }

    if(season_id){
      where.season_id = Number(season_id);
    }
    
     if(gameweek_id){
      where.gameweek_id = Number(gameweek_id);
    }

    // status filter
    if (status) {
      where.status = status;
    }

    // type filter
    if (type) {
      where.type = type;
    }

    if(group_name){
      where.group_name = group_name
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
        gameweek: true,
        season: true,
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
export async function getMatchBySlugController(
  req: Request,
  res: Response
): Promise<Response<MatchT>> {
  try {
    const { slug } = req.params;

    const isId = !isNaN(Number(slug));

    const match = await prisma.match.findFirst({
      where: isId ? { id: Number(slug) } : { slug: slug as string },
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
export async function updateMatchController(
  req: Request,
  res: Response
): Promise<Response<MatchT>> {
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
export async function deleteMatchController(
  req: Request,
  res: Response
): Promise<Response> {
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
export async function voteMatchController(
  req: Request,
  res: Response
): Promise<Response<MatchVoteT>> {
  try {
    const userId = req?.user?.id;
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

export async function getMatchVotesController(
  req: Request,
  res: Response
): Promise<Response<MatchVoteResultT>> {
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

export async function createScoreOptionController(
  req: Request,
  res: Response
): Promise<Response<ScoreOptionT>> {
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

export async function getScoreOptionsController(
  req: Request,
  res: Response
): Promise<Response<ScoreOptionT[]>> {
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

export async function updateScoreOptionController(
  req: Request,
  res: Response
): Promise<Response<ScoreOptionT>> {
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

export async function deleteScoreOptionController(
  req: Request,
  res: Response
): Promise<Response> {
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
): Promise<Response<ScorePredictionT>> {
  try {
    const userId = req.user?.id;
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
 * Get Prediction Results @check
 */
export async function getPredictionResultsController(
  req: Request,
  res: Response
): Promise<
  Response<{ total_votes: number; predictions: ApiResScorePredictionT[] }>
> {
  try {
    const userId = req.user?.id;
    const matchId = Number(req.params.id);

    if (Number.isNaN(matchId)) {
      return errorResponse(res, "Invalid match id", "", 400);
    }

    const [options, userVotes] = await Promise.all([
      prisma.scoreOption.findMany({
        where: { match_id: matchId },
        include: {
          _count: {
            select: { votes: true },
          },
          admin_score_prediction: true,
        },
      }),

      userId
        ? prisma.scorePrediction.findMany({
            where: { user_id: userId, match_id: matchId },
            select: { score_option_id: true },
          })
        : [],
    ]);

    const votedOptionIds = new Set(userVotes.map((v) => v.score_option_id));

    const totalVotes = options.reduce((sum, o) => {
      const adminVotes = o.admin_score_prediction?.vote_count ?? 0;
      return sum + o._count.votes + adminVotes;
    }, 0);

    const results = options.map((o) => {
      const userVotes = o._count.votes;
      const adminVotes = o.admin_score_prediction?.vote_count ?? 0;
      const votes = userVotes + adminVotes;

      return {
        id: o.id,
        home_score: o.home_score,
        away_score: o.away_score,

        votes,
        u_votes: userVotes,
        uu_votes: adminVotes,

        current_user_vote: votedOptionIds.has(o.id),

        percent:
          totalVotes === 0
            ? 0
            : Number(((votes / totalVotes) * 100).toFixed(2)),
      };
    });

    return successResponse(res, "Prediction results fetched", {
      total_votes: totalVotes,
      predictions: results,
    });
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to fetch predictions",
      error.message,
      500
    );
  }
}

/**
 * Get Admin Match Votes @check
 */
export async function getAdminMatchVotesController(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.id;
    const matchId = Number(req.params.id);

    const [userVotes, adminVotes, currentUserVote] = await Promise.all([
      prisma.matchVote.groupBy({
        by: ["vote"],
        where: { match_id: matchId },
        _count: true,
      }),

      prisma.adminMatchVote.findUnique({
        where: { match_id: matchId },
      }),

      userId
        ? prisma.matchVote.findUnique({
            where: {
              user_id_match_id: {
                user_id: userId,
                match_id: matchId,
              },
            },
            select: { vote: true },
          })
        : null,
    ]);

    let userHome = 0;
    let userDraw = 0;
    let userAway = 0;

    userVotes.forEach((v) => {
      if (v.vote === "HOME") userHome = v._count;
      if (v.vote === "DRAW") userDraw = v._count;
      if (v.vote === "AWAY") userAway = v._count;
    });

    const userTotal = userHome + userDraw + userAway;

    const adminHome = adminVotes?.home_votes ?? 0;
    const adminDraw = adminVotes?.draw_votes ?? 0;
    const adminAway = adminVotes?.away_votes ?? 0;

    const adminTotal = adminHome + adminDraw + adminAway;

    const homeVotes = userHome + adminHome;
    const drawVotes = userDraw + adminDraw;
    const awayVotes = userAway + adminAway;

    const totalVotes = homeVotes + drawVotes + awayVotes;

    const percent = (n: number) =>
      totalVotes === 0 ? 0 : Number(((n / totalVotes) * 100).toFixed(2));

    return successResponse(res, "Match votes fetched", {
      vote_id: adminVotes?.id ?? null,
      match_id: matchId,

      home_votes: homeVotes,
      draw_votes: drawVotes,
      away_votes: awayVotes,
      total_votes: totalVotes,

      home_percentage: percent(homeVotes),
      draw_percentage: percent(drawVotes),
      away_percentage: percent(awayVotes),

      current_user_vote: currentUserVote?.vote ?? null,

      u_votes: {
        home: userHome,
        draw: userDraw,
        away: userAway,
        total: userTotal,
      },

      uu_votes: {
        home: adminHome,
        draw: adminDraw,
        away: adminAway,
        total: adminTotal,
      },
    });
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch votes", error.message, 500);
  }
}

/**
 * Update Admin Match Vote
 */

export async function updateAdminMatchVoteController(
  req: Request,
  res: Response
) {
  try {
    const matchId = Number(req.params.id);
    const { home_votes, draw_votes, away_votes } = req.body;
    const userId = (req as any).user?.id;

    if (!matchId) {
      return errorResponse(res, "match_id is required");
    }

    const existingVote = await prisma.adminMatchVote.findUnique({
      where: { match_id: Number(matchId) },
    });

    let vote;

    if (!existingVote) {
      // CREATE
      vote = await prisma.adminMatchVote.create({
        data: {
          match_id: Number(matchId),
          home_votes: Number(home_votes) || 0,
          draw_votes: Number(draw_votes) || 0,
          away_votes: Number(away_votes) || 0,
          user_id: userId,
        },
      });
    } else {
      // UPDATE
      vote = await prisma.adminMatchVote.update({
        where: { match_id: Number(matchId) },
        data: {
          home_votes: Number(home_votes) ?? existingVote.home_votes,
          draw_votes: Number(draw_votes) ?? existingVote.draw_votes,
          away_votes: Number(away_votes) ?? existingVote.away_votes,
          user_id: userId,
        },
      });
    }

    const totalVotes = vote.home_votes + vote.draw_votes + vote.away_votes;

    return successResponse(res, "Admin match votes saved", {
      id: vote.id,
      match_id: vote.match_id,
      home_votes: vote.home_votes,
      draw_votes: vote.draw_votes,
      away_votes: vote.away_votes,
      total_votes: totalVotes,
    });
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to update admin votes",
      error.message,
      500
    );
  }
}

/**
 * Update Admin Score Predictions
 */

export async function updateAdminScorePredictionController(
  req: Request,
  res: Response
) {
  try {
    const matchId = Number(req.params.id);
    const { home_score, away_score, vote_count } = req.body;
    const userId = (req as any).user?.id;

    if (!matchId || home_score === undefined || away_score === undefined) {
      return errorResponse(
        res,
        "match_id, home_score and away_score are required"
      );
    }

    // STEP 1: Check ScoreOption
    const scoreOption = await prisma.scoreOption.findUnique({
      where: {
        match_id_home_score_away_score: {
          match_id: Number(matchId),
          home_score: Number(home_score),
          away_score: Number(away_score),
        },
      },
    });

    if (!scoreOption) {
      return errorResponse(
        res,
        "Score option does not exist. Please create score option first."
      );
    }

    // STEP 2: Check AdminScorePrediction
    const existingAdminScore = await prisma.adminScorePrediction.findUnique({
      where: {
        score_option_id: scoreOption.id,
      },
    });

    let adminScore;

    if (!existingAdminScore) {
      // CREATE
      adminScore = await prisma.adminScorePrediction.create({
        data: {
          score_option_id: scoreOption.id,
          vote_count: Number(vote_count) || 0,
          user_id: userId,
        },
      });
    } else {
      // UPDATE
      adminScore = await prisma.adminScorePrediction.update({
        where: {
          score_option_id: scoreOption.id,
        },
        data: {
          vote_count: Number(vote_count) ?? existingAdminScore.vote_count,
          user_id: userId,
        },
      });
    }

    return successResponse(res, "Admin score prediction updated", {
      id: adminScore.id,
      score_option_id: scoreOption.id,
      match_id: matchId,
      home_score: scoreOption.home_score,
      away_score: scoreOption.away_score,
      vote_count: adminScore.vote_count,
    });
  } catch (error: any) {
    return errorResponse(
      res,
      "Failed to update admin score prediction",
      error.message,
      500
    );
  }
}
