import { Request, Response } from "express";
import prisma from "../../prisma";

export const getLeagueSeasonWinnerVotesController = async (
  req: Request,
  res: Response
) => {
  try {
    const leagueSeasonId = parseInt(req.params.leagueSeasonId as string);

    const leagueSeason = await prisma.leagueSeason.findUnique({
      where: { id: leagueSeasonId },
      include: {
        league: true,
        season: true,
      },
    });

    if (!leagueSeason) {
      return res.status(404).json({
        success: false,
        error: "League season not found",
      });
    }

    const userVotes = await prisma.winnerVote.groupBy({
      by: ["team_id"],
      where: { league_season_id: leagueSeasonId },
      _count: true,
    });

    const adminVotes = await prisma.adminWinnerVote.findMany({
      where: { league_season_id: leagueSeasonId },
      include: {
        team: true,
      },
    });

    const teamVotesMap = new Map();

    userVotes.forEach((vote) => {
      teamVotesMap.set(vote.team_id, {
        team_id: vote.team_id,
        user_votes: vote._count,
        admin_votes: 0,
        total_votes: vote._count,
      });
    });

    adminVotes.forEach((vote) => {
      const existing = teamVotesMap.get(vote.team_id);
      if (existing) {
        existing.admin_votes += vote.vote_count;
        existing.total_votes += vote.vote_count;
      } else {
        teamVotesMap.set(vote.team_id, {
          team_id: vote.team_id,
          user_votes: 0,
          admin_votes: vote.vote_count,
          total_votes: vote.vote_count,
        });
      }
    });

    const teamsWithVotes = await prisma.team.findMany({
      where: {
        id: {
          in: Array.from(teamVotesMap.keys()),
        },
      },
    });

    const result = Array.from(teamVotesMap.values()).map((voteData) => {
      const team = teamsWithVotes.find((t) => t.id === voteData.team_id);
      return {
        team_id: voteData.team_id,
        team_name: team?.name || "Unknown",
        team_logo: team?.logo_url || "",
        user_votes: voteData.user_votes,
        admin_votes: voteData.admin_votes,
        total_votes: voteData.total_votes,
      };
    }).sort((a, b) => b.total_votes - a.total_votes);

    return res.json({
      success: true,
      data: {
        league_season: leagueSeason,
        votes: result,
      },
    });
  } catch (error: any) {
    console.error("Error fetching winner votes:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch winner votes",
    });
  }
};

export const getUserWinnerVoteController = async (req: Request, res: Response) => {
  try {
    const leagueSeasonId = parseInt(req.params.leagueSeasonId as string);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const userVote = await prisma.winnerVote.findUnique({
      where: {
        user_id_league_season_id: {
          user_id: userId,
          league_season_id: leagueSeasonId,
        },
      },
      include: {
        team: true,
      },
    });

    return res.json({
      success: true,
      data: userVote,
    });
  } catch (error: any) {
    console.error("Error fetching user vote:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch user vote",
    });
  }
};

export const createWinnerVoteController = async (req: Request, res: Response) => {
  try {
    const { league_season_id, team_id } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const existingVote = await prisma.winnerVote.findUnique({
      where: {
        user_id_league_season_id: {
          user_id: userId,
          league_season_id,
        },
      },
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        error: "You have already voted for this league season",
      });
    }

    const vote = await prisma.winnerVote.create({
      data: {
        user_id: userId,
        league_season_id,
        team_id,
      },
      include: {
        team: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: vote,
    });
  } catch (error: any) {
    console.error("Error creating winner vote:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create winner vote",
    });
  }
};

export const updateWinnerVoteController = async (req: Request, res: Response) => {
  try {
    const voteId = parseInt(req.params.voteId as string);
    const { team_id } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const existingVote = await prisma.winnerVote.findUnique({
      where: { id: voteId },
    });

    if (!existingVote || existingVote.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Vote not found or unauthorized",
      });
    }

    const updatedVote = await prisma.winnerVote.update({
      where: { id: voteId },
      data: { team_id },
      include: {
        team: true,
      },
    });

    return res.json({
      success: true,
      data: updatedVote,
    });
  } catch (error: any) {
    console.error("Error updating winner vote:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update winner vote",
    });
  }
};

export const createAdminWinnerVoteController = async (req: Request, res: Response) => {
  try {
    const { league_season_id, team_id, user_id, vote_count = 0 } = req.body;
    const authUserId = (req as any).user?.id;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const authUser = await prisma.user.findUnique({
      where: { id: authUserId },
    });

    if (authUser?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    const existingVote = await prisma.adminWinnerVote.findUnique({
      where: {
        league_season_id_team_id: {
          league_season_id,
          team_id,
        },
      },
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        error: "Admin vote already exists for this team in this season",
      });
    }

    const vote = await prisma.adminWinnerVote.create({
      data: {
        league_season_id,
        team_id,
        user_id,
        vote_count,
      },
      include: {
        team: true,
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: vote,
    });
  } catch (error: any) {
    console.error("Error creating admin winner vote:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create admin winner vote",
    });
  }
};

export const updateAdminWinnerVoteController = async (req: Request, res: Response) => {
  try {
    const voteId = parseInt(req.params.voteId as string);
    const { vote_count, team_id } = req.body;
    const authUserId = (req as any).user?.id;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const authUser = await prisma.user.findUnique({
      where: { id: authUserId },
    });

    if (authUser?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    const updateData: any = {};
    if (vote_count !== undefined) updateData.vote_count = vote_count;
    if (team_id !== undefined) updateData.team_id = team_id;

    const updatedVote = await prisma.adminWinnerVote.update({
      where: { id: voteId },
      data: updateData,
      include: {
        team: true,
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      data: updatedVote,
    });
  } catch (error: any) {
    console.error("Error updating admin winner vote:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update admin winner vote",
    });
  }
};

export const deleteAdminWinnerVoteController = async (req: Request, res: Response) => {
  try {
    const voteId = parseInt(req.params.voteId as string);
    const authUserId = (req as any).user?.id;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const authUser = await prisma.user.findUnique({
      where: { id: authUserId },
    });

    if (authUser?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    await prisma.adminWinnerVote.delete({
      where: { id: voteId },
    });

    return res.json({
      success: true,
      message: "Admin winner vote deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting admin winner vote:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to delete admin winner vote",
    });
  }
};
