import { Request, Response } from "express";
import prisma from "../../prisma";
import { errorResponse, successResponse } from "../../lib/responseUtils";



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