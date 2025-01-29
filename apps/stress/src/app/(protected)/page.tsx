import { apps } from "@config/ui";
import { LogSocketProvider } from "@ui/components/providers/log-socket-provider";
import dynamic from "next/dynamic";

const VideoSession = dynamic(() => import("./_components/video-session"), { ssr: false });

export default function Page() {
  const app = apps.stress;
  return (
    <main className="relative w-full h-[calc(100vh-theme(spacing.14))] bg-background ">
      <LogSocketProvider url={app.socket}>
        <VideoSession />
      </LogSocketProvider>
    </main>
  );
}
