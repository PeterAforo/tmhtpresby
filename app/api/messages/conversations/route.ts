import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ── GET: list user's conversations ─────────────────────────────────
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: session.user.id },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Conversations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations." },
      { status: 500 }
    );
  }
}

// ── POST: create a new conversation ────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { participantIds, type = "direct", name } = body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { error: "At least one participant is required." },
        { status: 400 }
      );
    }

    // For direct messages, check if conversation already exists
    if (type === "direct" && participantIds.length === 1) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: "direct",
          AND: [
            { participants: { some: { userId: session.user.id } } },
            { participants: { some: { userId: participantIds[0] } } },
          ],
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (existingConversation) {
        return NextResponse.json({ conversation: existingConversation });
      }
    }

    // Create new conversation
    const allParticipants = [...new Set([session.user.id, ...participantIds])];

    const conversation = await prisma.conversation.create({
      data: {
        type,
        name: type === "group" ? name : null,
        participants: {
          create: allParticipants.map((userId, index) => ({
            userId,
            role: index === 0 ? "admin" : "member",
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error("Conversations POST error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation." },
      { status: 500 }
    );
  }
}
