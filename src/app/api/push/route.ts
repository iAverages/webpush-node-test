import { NextResponse, type NextRequest } from "next/server";

import webpush, { type PushSubscription } from "web-push";
import { CONFIG } from "~/config";
import { db } from "~/server/db";

webpush.setVapidDetails(
  "mailto:yippie@danielraybone.com",
  CONFIG.PUBLIC_KEY,
  CONFIG.PRIVATE_KEY,
);

export async function POST(request: NextRequest) {
  const subscription = (await request.json()) as object | null;

  if (!subscription) {
    console.error("No subscription was provided!");
    return;
  }

  const data = await db.pushNotifis.create({
    data: {
      data: subscription,
    },
  });

  return NextResponse.json({ message: "success", data });
}

export async function GET(_: NextRequest) {
  const subscriptions = await db.pushNotifis.findMany({
    select: {
      data: true,
    },
  });

  subscriptions.forEach((s) => {
    console.log(s);
    const payload = JSON.stringify({
      title: "WebPush Notification!",
      body: "Hello World",
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    void webpush.sendNotification(s.data as any, payload);
  });

  return NextResponse.json({
    message: `${subscriptions.length} messages sent!`,
  });
}
