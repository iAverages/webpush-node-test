"use client";

import { useState } from "react";
import { registerServiceWorker, resetServiceWorker } from "~/utilts/sw";
import { CONFIG } from "~/config";

const notificationsSupported = () =>
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

void registerServiceWorker();

export default function Notifications() {
  const [permission, setPermission] = useState(
    window?.Notification?.permission || "default",
  );

  const [a, setA] = useState("");

  if (!notificationsSupported()) {
    return <div>Install PWA</div>;
  }

  const requestPermission = async () => {
    if (!notificationsSupported()) {
      alert("not inside pwa/notifications not supported");
      return;
    }

    const receivedPermission = await window?.Notification.requestPermission();
    setPermission(receivedPermission);

    if (receivedPermission === "granted") {
      const res = await subscribe();
      setA(JSON.stringify(res));
      alert("subscribed");
    }
  };

  return (
    <>
      <div>Notifications permission status: {permission}</div>
      <button onClick={requestPermission}>
        Request permission and subscribe
      </button>
      {a && <div>{a}</div>}
    </>
  );
}

const saveSubscription = async (subscription: PushSubscription) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/push`;

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};

const subscribe = async () => {
  const swRegistration = await resetServiceWorker();

  try {
    const options = {
      applicationServerKey: CONFIG.PUBLIC_KEY,
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);

    await saveSubscription(subscription);

    alert({ subscription });

    return subscription;
  } catch (err) {
    const error = err as Error;
    alert("Error: " + JSON.stringify(error.message));
    return error.message;
  }
};
