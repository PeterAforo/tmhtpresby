import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  };
  resourceType?: "image" | "video" | "raw" | "auto";
}

export async function uploadToCloudinary(
  file: string | Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { folder = "tmht-presby", transformation, resourceType = "auto" } = options;

  try {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: resourceType,
    };

    if (transformation) {
      uploadOptions.transformation = transformation;
    }

    let result;
    if (typeof file === "string" && file.startsWith("data:")) {
      // Base64 data URL
      result = await cloudinary.uploader.upload(file, uploadOptions);
    } else if (typeof file === "string") {
      // URL or file path
      result = await cloudinary.uploader.upload(file, uploadOptions);
    } else {
      // Buffer - convert to base64
      const base64 = `data:image/png;base64,${file.toString("base64")}`;
      result = await cloudinary.uploader.upload(base64, uploadOptions);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file");
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

export async function listCloudinaryFiles(
  folder: string = "tmht-presby",
  options: { maxResults?: number; nextCursor?: string; resourceType?: string } = {}
): Promise<{
  files: Array<{
    publicId: string;
    url: string;
    format: string;
    size: number;
    width?: number;
    height?: number;
    createdAt: string;
  }>;
  nextCursor?: string;
}> {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: options.maxResults || 50,
      next_cursor: options.nextCursor,
      resource_type: options.resourceType || "image",
    });

    return {
      files: result.resources.map((r: Record<string, unknown>) => ({
        publicId: r.public_id as string,
        url: r.secure_url as string,
        format: r.format as string,
        size: r.bytes as number,
        width: r.width as number | undefined,
        height: r.height as number | undefined,
        createdAt: r.created_at as string,
      })),
      nextCursor: result.next_cursor,
    };
  } catch (error) {
    console.error("Cloudinary list error:", error);
    return { files: [] };
  }
}

export async function createCloudinaryFolder(folderPath: string): Promise<boolean> {
  try {
    await cloudinary.api.create_folder(folderPath);
    return true;
  } catch (error) {
    console.error("Cloudinary create folder error:", error);
    return false;
  }
}

export async function listCloudinaryFolders(
  parentFolder: string = ""
): Promise<Array<{ name: string; path: string }>> {
  try {
    const result = await cloudinary.api.sub_folders(parentFolder || "tmht-presby");
    return result.folders.map((f: { name: string; path: string }) => ({
      name: f.name,
      path: f.path,
    }));
  } catch (error) {
    console.error("Cloudinary list folders error:", error);
    return [];
  }
}

export { cloudinary };
