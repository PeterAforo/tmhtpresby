import webpush from "web-push";
import { prisma } from "@/lib/db";

// Configure VAPID keys
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@mhtpcaccra.org";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: {
    deep_link?: string;
    type?: string;
    resource_id?: string;
    action?: string;
  };
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
}

/**
 * Send a push notification to a specific user
 */
export async function sendPushNotification(
  userId: string,
  payload: PushPayload
): Promise<{ success: number; failed: number }> {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  let success = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload)
      );
      success++;
    } catch (error: unknown) {
      const statusCode = (error as { statusCode?: number })?.statusCode;
      // If subscription is expired or invalid, remove it
      if (statusCode === 410 || statusCode === 404) {
        await prisma.pushSubscription.delete({
          where: { id: sub.id },
        });
      }
      failed++;
      console.error(`Failed to send push to ${sub.endpoint}:`, error);
    }
  }

  return { success, failed };
}

/**
 * Send a push notification to multiple users
 */
export async function broadcastPushNotification(
  userIds: string[],
  payload: PushPayload
): Promise<{ success: number; failed: number }> {
  let totalSuccess = 0;
  let totalFailed = 0;

  for (const userId of userIds) {
    const result = await sendPushNotification(userId, payload);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  return { success: totalSuccess, failed: totalFailed };
}

/**
 * Send a push notification to all subscribed users
 */
export async function sendPushToAll(
  payload: PushPayload
): Promise<{ success: number; failed: number }> {
  const subscriptions = await prisma.pushSubscription.findMany();

  let success = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload)
      );
      success++;
    } catch (error: unknown) {
      const statusCode = (error as { statusCode?: number })?.statusCode;
      if (statusCode === 410 || statusCode === 404) {
        await prisma.pushSubscription.delete({
          where: { id: sub.id },
        });
      }
      failed++;
    }
  }

  return { success, failed };
}

// Notification type builders
export const NotificationPayloads = {
  newSermon: (title: string, speaker: string, slug: string): PushPayload => ({
    title: "New Sermon Available",
    body: `Watch "${title}" by ${speaker}`,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    tag: "sermon",
    data: {
      type: "sermon",
      deep_link: `/sermons/${slug}`,
    },
    actions: [
      { action: "view", title: "Watch Now" },
      { action: "dismiss", title: "Later" },
    ],
  }),

  eventReminder: (title: string, date: string, slug: string): PushPayload => ({
    title: "Event Reminder",
    body: `${title} is coming up on ${date}`,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    tag: "event",
    data: {
      type: "event",
      deep_link: `/events/${slug}`,
    },
    actions: [
      { action: "view", title: "View Event" },
      { action: "dismiss", title: "Dismiss" },
    ],
  }),

  communityReply: (postTitle: string, postId: string): PushPayload => ({
    title: "New Reply",
    body: `Someone replied to your post: "${postTitle}"`,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    tag: "community",
    data: {
      type: "community",
      deep_link: `/community/${postId}`,
    },
  }),

  donationReceipt: (amount: string): PushPayload => ({
    title: "Thank You for Your Gift",
    body: `Your donation of GHS ${amount} has been received.`,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    tag: "donation",
    data: {
      type: "donation",
      deep_link: "/give/history",
    },
  }),

  announcement: (title: string, message: string): PushPayload => ({
    title,
    body: message,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    tag: "announcement",
    requireInteraction: true,
  }),
};
