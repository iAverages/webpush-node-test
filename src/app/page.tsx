import dynamic from "next/dynamic";
import { registerServiceWorker } from "~/utilts/sw";

const Notifications = dynamic(() => import("~/app/_components/notif"), {
  ssr: false, // Make sure to render component client side to access window and Notification API's
});

void registerServiceWorker();

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <Notifications />
    </main>
  );
}
