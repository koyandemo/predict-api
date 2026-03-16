import { errorResponse, successResponse } from "../../lib/responseUtils";
import prisma from "../../prisma";
import { Request, Response } from "express";

/**
 * Create Comment
 */
export async function createCommentController(req: Request, res: Response) {
  try {
    let userIdx ="";

    // const userId = req.user?.id;
    const matchId = Number(req.params.id);
    const { text,userId } = req.body;

    if(userId){
      userIdx = userId.toString();
    }else{
      userIdx = req.user?.id;
    }

    if (!matchId || !userIdx || !text) {
      return errorResponse(
        res,
        "match_id, user_id and text are required",
        "",
        400
      );
    }

    const comment = await prisma.comment.create({
      data: {
        match_id: Number(matchId),
        user_id: Number(userIdx),
        text,
        parent_id:null
      },
      include: {
        user: true,
      },
    });

    return successResponse(res, "Comment created successfully", comment, 201);
  } catch (error: any) {
    console.log(error, "37");
    return errorResponse(error, "Failed to create comment", error.message, 500);
  }
}

/**
 * Get All Comments by Match
 */
export async function getAllCommentsController(req: Request, res: Response) {
  try {
    const userId = req.user?.id || null;
    const matchId = Number(req.params.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const comments = await prisma.comment.findMany({
      where: {
        match_id: matchId,
        parent_id: null,
      },
      include: {
        user: true,
        reactions: true,
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: limit,
    });

    const formatted = comments.map((comment) => {
      const likes = comment.reactions.filter(
        (r) => r.reaction === "LIKE"
      ).length;

      const dislikes = comment.reactions.filter(
        (r) => r.reaction === "DISLIKE"
      ).length;

      const hasUserLiked = comment.reactions.find(
        (r) => r.user_id === userId && r.reaction === "LIKE"
      );

      return {
        id: comment.id,
        match_id: comment.match_id,
        user_id: comment.user_id,
        text: comment.text,
        user: comment.user,
        timestamp: comment.created_at,
        likes,
        dis_likes: dislikes,
        reply_count: comment._count.replies,

        is_replay: false,
        parent_id: comment.parent_id,

        has_user_liked: !!hasUserLiked,
      };
    });

    const total = await prisma.comment.count({
      where: {
        match_id: matchId,
        parent_id: null,
      },
    });

    return successResponse(res, "Comments fetched successfully", {
      data: formatted,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch comments", error.message, 500);
  }
}

/**
 * Create Reply Comment
 */
export async function createReplyCommentController(
  req: Request,
  res: Response
) {
  try {
    let userIdx = "";
    // const userId = req.user?.id;
    const parentId = Number(req.params.parentCommentId);
    const { match_id, text,userId } = req.body;

    if(userId){
      userIdx = userId.toString();
    }else{
      userIdx = req.user?.id;
    }

    if (!match_id || !userIdx || !text) {
      return errorResponse(
        res,
        "match_id, user_id and text are required",
        "",
        400
      );
    }

    const comment = await prisma.comment.create({
      data: {
        match_id: Number(match_id),
        user_id: Number(userIdx),
        text,
        parent_id: parentId,
      },
      include: {
        user: true,
      },
    });

    return successResponse(res, "Reply created successfully", comment, 201);
  } catch (error: any) {
    return errorResponse(res, "Failed to create reply", error.message, 500);
  }
}

/**
 * Get Replies for a Comment
 */
// export const getReplies = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id ?? null;
//     const commentId = Number(req.params.commentId);

//     const replies = await prisma.comment.findMany({
//       where: {
//         parent_id: commentId,
//       },
//       include: {
//         user: true,
//         reactions: true,
//         _count: {
//           select: {
//             replies: true,
//           },
//         },
//       },
//       orderBy: {
//         created_at: "desc",
//       },
//     });

//     const formatted = replies.map((reply) => {
//       const likes = reply.reactions.filter((r) => r.reaction === "LIKE").length;

//       const dislikes = reply.reactions.filter(
//         (r) => r.reaction === "DISLIKE"
//       ).length;

//       const hasUserLiked = userId
//         ? reply.reactions.some(
//             (r) => r.user_id === userId && r.reaction === "LIKE"
//           )
//         : false;

//       const hasUserDisliked = userId
//         ? reply.reactions.some(
//             (r) => r.user_id === userId && r.reaction === "DISLIKE"
//           )
//         : false;

//       return {
//         id: reply.id,
//         match_id: reply.match_id,
//         user_id: reply.user_id,
//         text: reply.text,
//         user: reply.user,
//         timestamp: reply.created_at,

//         likes,
//         dis_likes: dislikes,

//         reply_count: reply._count.replies,

//         is_reply: true,
//         parent_id: reply.parent_id,

//         has_user_liked: hasUserLiked,
//         has_user_disliked: hasUserDisliked,
//       };
//     });

//     return successResponse(res, "Replies fetched successfully", formatted);
//   } catch (error: any) {
//     return errorResponse(res, "Failed to fetch replies", error.message, 500);
//   }
// };

/**
 * Get Replies for a Comment
 */
export const getReplies = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id ?? null;
    const commentId = Number(req.params.commentId);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const replies = await prisma.comment.findMany({
      where: {
        parent_id: commentId,
      },
      include: {
        user: true,
        reactions: true,
        _count: {
          select: {
            replies: true,    
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: limit,
    });

    const formatted = replies.map((reply) => {
      const likes = reply.reactions.filter((r) => r.reaction === "LIKE").length;

      const dislikes = reply.reactions.filter(
        (r) => r.reaction === "DISLIKE"
      ).length;

      const hasUserLiked = userId
        ? reply.reactions.some(
            (r) => r.user_id === userId && r.reaction === "LIKE"
          )
        : false;

      const hasUserDisliked = userId
        ? reply.reactions.some(
            (r) => r.user_id === userId && r.reaction === "DISLIKE"
          )
        : false;

      return {
        id: reply.id,
        match_id: reply.match_id,
        user_id: reply.user_id,
        text: reply.text,
        user: reply.user,
        timestamp: reply.created_at,

        likes,
        dis_likes: dislikes,

        reply_count: reply._count.replies,

        is_reply: true,
        parent_id: reply.parent_id,

        has_user_liked: hasUserLiked,
        has_user_disliked: hasUserDisliked,
      };
    });

    const total = await prisma.comment.count({
      where: {
        parent_id: commentId,
      },
    });

    return successResponse(res, "Replies fetched successfully", {
      data: formatted,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch replies", error.message, 500);
  }
};

/**
 * Add Reaction to Comment
 */
export const addReaction = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const commentId = Number(req.params.commentId);
  const { reaction_type } = req.body;

  await prisma.commentReaction.upsert({
    where: {
      comment_id_user_id: {
        user_id: userId,
        comment_id: commentId,
      },
    },
    update: {
      reaction: reaction_type.toUpperCase(),
    },
    create: {
      user_id: userId,
      comment_id: commentId,
      reaction: reaction_type.toUpperCase(),
    },
  });

  const count = await prisma.commentReaction.count({
    where: {
      comment_id: commentId,
      reaction: reaction_type.toUpperCase(),
    },
  });

  res.json({
    success: true,
    data: {
      reaction_count: count,
    },
  });
};
