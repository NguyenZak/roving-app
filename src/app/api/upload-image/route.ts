import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Ensure Node.js runtime (Buffer required)
export const runtime = "nodejs";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Missing 'file' in form-data" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    type CloudinaryUploadResult = {
      asset_id: string;
      public_id: string;
      version: number;
      signature: string;
      width: number;
      height: number;
      format: string;
      resource_type: string;
      created_at: string;
      tags: string[];
      pages?: number;
      bytes: number;
      type: string;
      etag: string;
      placeholder: boolean;
      url: string;
      secure_url: string;
      folder?: string;
      api_key?: string;
    };

    const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: "fresh-travel",
          resource_type: "image",
          // You can transform as needed, e.g., width, quality, format
          // transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, res) => {
          if (error) return reject(error);
          // Cloudinary types are broad; cast via unknown first
          resolve((res as unknown) as CloudinaryUploadResult);
        }
      );

      upload.end(buffer);
    });

    // TinyMCE expects { location: "https://..." }
    return NextResponse.json({ location: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      fullError: error
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    return NextResponse.json(
      { 
        error: "Image upload failed", 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}


