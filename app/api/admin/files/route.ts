import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listCloudinaryFiles, listCloudinaryFolders, createCloudinaryFolder } from "@/lib/upload";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || "tmht-presby";
    const type = searchParams.get("type") || "all"; // all, files, folders
    const cursor = searchParams.get("cursor") || undefined;

    if (type === "folders") {
      const folders = await listCloudinaryFolders(folder);
      return NextResponse.json({ folders });
    }

    const { files, nextCursor } = await listCloudinaryFiles(folder, {
      maxResults: 50,
      nextCursor: cursor,
    });

    let folders: Array<{ name: string; path: string }> = [];
    if (type === "all") {
      folders = await listCloudinaryFolders(folder);
    }

    return NextResponse.json({ files, folders, nextCursor });
  } catch (error) {
    console.error("List files error:", error);
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}

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

    const { action, folderPath } = await req.json();

    if (action === "createFolder" && folderPath) {
      const success = await createCloudinaryFolder(folderPath);
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Files action error:", error);
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
  }
}
