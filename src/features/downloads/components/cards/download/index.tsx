import { cn } from "@/lib";
import { useEffect, useState } from "react";
import DownloadCardActions from "./actions";
import DownloadCardStat from "./stat";
import DownloadCardTitle from "./title";

interface Props {
  downloading?: boolean;
  image?: string;
  title: string;
  poster: string;
}

const DownloadCard = ({ downloading = false, image, title, poster }: Props) => {
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (!downloading) return;

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }

        // Get a random number between 0 and 0.01
        return prev + Math.random() * 0.005;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [downloading]);

  return (
    <div
      className={cn("w-full h-60 flex relative group", {
        "h-48": !downloading,
      })}
    >
      {/* BG */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full relative z-[1]"
        />

        <div
          className={cn(
            "absolute inset-0 size-full bg-background opacity-55 z-[2]",
            {
              "opacity-90": !downloading,
            }
          )}
        />

        {/* DOWNLOAD BAR */}
        {!!downloading && (
          <div className="absolute inset-x-0 bottom-0 z-[3] w-full h-1 bg-primary/20">
            <div
              className={`"absolute inset-x-0 bottom-0 z-[4] h-full bg-gradient-to-br from-blue-400 to-purple-400 transition-all duration-300 ease-in-out`}
              style={{ width: `${downloadProgress * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-row items-start justify-between size-full relative z-10 px-10 py-8">
        {/* NAME OF DOWNLOADG GAME */}
        {/* {!!downloading && <DownloadCardTitle title={title} />} */}
        <div className="flex justify-start items-end h-full w-[65%]">
          <div className="h-6 flex justify-end items-center">
            <DownloadCardTitle title={title} />
            <div className="overflow-hidden p-1  relative">
              {/* Start hidden */}
              <div className="-translate-x-24 group-focus-within:translate-x-0 group-hover:translate-x-0 transition duration-300 pl-3 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
                <DownloadCardActions />
              </div>
            </div>
          </div>
        </div>

        {/* DOWNLOADING STATS */}
        <div className="flex gap-4 items-end justify-between h-full flex-1">
          {!!downloading && (
            <>
              <DownloadCardStat title="Current" text="10 mb/s" key="current" />

              <DownloadCardStat title="Peak" text="25 mb/s" key="peak" />

              <DownloadCardStat title="Total" text="25 GB" key="total" />

              <DownloadCardStat title="Disk usage" text="5 mb/s" key="disk" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;
