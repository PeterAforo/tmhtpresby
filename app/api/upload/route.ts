import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string || "image";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Determine resource type and folder
    let resourceType: "image" | "video" | "raw" | "auto" = "auto";
    let folder = "churchweb/uploads";

    if (type === "image") {
      resourceType = "image";
      folder = "churchweb/images";
    } else if (type === "video") {
      resourceType = "video";
      folder = "churchweb/videos";
    } else if (type === "audio") {
      resourceType = "video"; // Cloudinary treats audio as video
      folder = "churchweb/audio";
    } else if (type === "document") {
      resourceType = "raw";
      folder = "churchweb/documents";
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-")}`,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
