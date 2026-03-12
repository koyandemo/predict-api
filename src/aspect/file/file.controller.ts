import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { Request, Response } from "express";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "AKIAWCHNY7WN3FS2YEVA",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "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",
  },
});

// Get Presigned URL for Upload / Update
export const getPresignedUrl = async (req: Request, res: Response) => {
  try {
    const { contentType, folder, updateUrl } = req.body;
    
    if (!contentType || !folder) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        error: "MISSING_REQUIRED_FIELDS"
      });
    }

    // Reuse existing key if updating
    let key: string;
    if (updateUrl) {
      const url = new URL(updateUrl);
      key = url.pathname.substring(1); // strip leading "/"
    } else {
      const fileExtension = contentType.split("/")[1] || "bin";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${fileExtension}`;
      key = `${folder}/${fileName}`;
    }
    
    const presignedPost = await createPresignedPost(s3Client, {
      Bucket: process.env.AWS_S3_BUCKET || "demo-img-upload-s3",
      Key: key,
      Conditions: [["starts-with", "$Content-Type", ""]],
      Fields: {
        "Content-Type": contentType,
      },
      Expires: 60, // 1 min
    });
    
    return res.status(200).json({
      success: true,
      data: presignedPost,
      message: "Presigned URL generated"
    });
  } catch (err: any) {
    console.error("Error generating presigned URL:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate presigned URL",
      error: err.message || "INTERNAL_SERVER_ERROR"
    });
  }
};