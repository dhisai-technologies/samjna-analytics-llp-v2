import { cn } from "@ui/utils";

type MediaType = "IMAGE" | "VIDEO" | "AUDIO";

interface MediaCardProps {
  src: string;
  type: MediaType;
  alt?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onEnded?: () => void;
}

export function MediaCard({
  src,
  type,
  alt = "",
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  className = "",
  onEnded,
}: MediaCardProps) {
  const renderMedia = () => {
    switch (type) {
      case "IMAGE":
        return <img src={src} alt={alt} className="w-full h-auto object-cover rounded-lg overflow-hidden" />;
      case "VIDEO":
        return (
          <video
            src={src}
            controls={controls}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            onEnded={onEnded}
            className="w-full h-auto rounded-lg overflow-hidden"
          >
            Your browser does not support the video tag.
          </video>
        );
      case "AUDIO":
        return (
          <audio
            src={src}
            controls={controls}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            className="w-full rounded-lg overflow-hidden"
          >
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return null;
    }
  };
  return <div className={cn("overflow-hidden flex items-center justify-center", className)}>{renderMedia()}</div>;
}
