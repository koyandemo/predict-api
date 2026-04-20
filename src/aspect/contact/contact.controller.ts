import { errorResponse, successResponse } from "../../lib/responseUtils";
import prisma from "../../prisma";
import { Request, Response } from "express";

/**
 * Create Comment
 */
export async function createContactController(req: Request, res: Response) {
  try {
    const { title, email, message } = req.body;

    // Basic validation
    if (!title || !email || !message) {
      return errorResponse(
        res,
        "Validation error",
        "Title, email, and message are required",
        400
      );
    }

    const contact = await prisma.contact.create({
      data: {
        title,
        email,
        message,
      },
    });

    return successResponse(res, "Contact created successfully", contact, 201);
  } catch (error: any) {
    return errorResponse(res, "Failed to create contact", error.message, 500);
  }
}

export async function getAllContactsController(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.contact.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(res, "Contacts fetched successfully", {
      data: contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error: any) {
    return errorResponse(res, "Failed to fetch contacts", error.message, 500);
  }
}
