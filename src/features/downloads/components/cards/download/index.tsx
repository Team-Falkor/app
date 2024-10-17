import { cn } from "@/lib";
import DownloadCardActions from "./actions";
import DownloadCardChartArea from "./chartArea";
import DownloadCardStat from "./stat";
import DownloadCardTitle from "./title";

interface Props {
  downloading?: boolean;
  image?: string;
  title: string;
  poster: string;
}

const DownloadCard = ({ downloading = false, image, title }: Props) => {
  return (
    <div
      className={cn("w-full h-60 flex relative group", {
        "h-48 ": !downloading,
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
              "opacity-90 overflow-hidden": !downloading,
            }
          )}
        />
      </div>

      {/* Content */}
      <div className="flex flex-row items-start justify-between size-full relative z-10 p-5 px-10">
        {/* NAME OF DOWNLOADG GAME */}
        {/* {!!downloading && <DownloadCardTitle title={title} />} */}
        <div className="flex justify-start items-end h-full w-[65%]">
          <div className="flex flex-col justify-start items-start gap-1.5">
            <div></div>

            <DownloadCardTitle title={title} />
            <div className="overflow-hidden p-1 relative">
              {/* Start hidden */}
              <DownloadCardActions
                downloading={downloading}
                startDownload={() => {}}
                stopDownload={() => {}}
                pauseDownload={() => {}}
              />
            </div>
          </div>
        </div>

        {/* DOWNLOADING STATS */}
        <div className="flex flex-col gap-4 items-end justify-between h-full flex-1">
          {!!downloading && (
            <>
              <div className="size-full overflow-hidden">
                <DownloadCardChartArea />
              </div>

              <div className="flex gap-4 justify-between w-full">
                <DownloadCardStat
                  title="Current"
                  text="10 mb/s"
                  key="current"
                />

                <DownloadCardStat title="Peak" text="25 mb/s" key="peak" />

                <DownloadCardStat title="Total" text="25 GB" key="total" />

                <DownloadCardStat title="Disk usage" text="5 mb/s" key="disk" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;
