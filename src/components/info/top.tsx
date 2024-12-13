import { InfoItadProps, InfoProps } from "@/@types";
import { cn, getSteamIdFromWebsites } from "@/lib";
import { InfoReturn, ReleaseDate } from "@/lib/api/igdb/types";
import { useMemo, useState } from "react";
import IGDBImage from "../IGDBImage";
import ProtonDbBadge from "../protonDbBadge";
import InfoTopSkeleton from "../skeletons/info/top.skeleton";
import { Button } from "../ui/button";
import SelectedInfoTab from "./tabs/selected";

type InfoTopProps = InfoProps & {
  data: InfoReturn | undefined;
  isReleased: boolean;
  releaseDate: ReleaseDate | null | undefined;
  // playingData: LibraryGame | null | undefined;
  // playingPending: boolean;
};

type Props = InfoTopProps & InfoItadProps;

const InfoTop = (props: Props) => {
  const { data, isPending, error } = props;
  const [activeTab, setActiveTab] = useState<number>(0);

  const steam_id = useMemo(
    () => getSteamIdFromWebsites(data?.websites ?? []),
    [data?.websites]
  );

  if (error) return null;

  if (isPending) return <InfoTopSkeleton />;

  return (
    <div className="flex h-[32rem] overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute w-full h-[38rem] z-0 bg-cover bg-center bg-no-repeat inset-0 overflow-hidden">
        <IGDBImage
          imageId={
            data?.screenshots?.[0]?.image_id ?? data?.cover?.image_id ?? ""
          }
          alt={data?.name ?? ""}
          className="relative z-0 object-cover w-full h-full overflow-hidden blur-md"
          imageSize="screenshot_med"
          loading="eager"
        />

        <span className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 flex items-start justify-between w-full gap-6 mb-5">
        {/* LEFT */}
        <div className="xl:w-[35%] h-full overflow-hidden rounded-2xl relative">
          <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
            <div className="flex flex-col justify-between w-full h-full">
              {/* ProtonDB badge */}
              <div className="flex items-start justify-end pt-5 size-full">
                <div className="overflow-hidden rounded-l-lg">
                  {steam_id ? <ProtonDbBadge appId={steam_id} /> : null}
                </div>
              </div>
            </div>
          </div>

          <IGDBImage
            imageId={data?.cover?.image_id ?? ""}
            alt={data?.name ?? ""}
            className="object-cover object-top w-full h-full overflow-hidden"
            loading="lazy"
          />
        </div>

        {/* INFO SECTION (RIGHT) */}
        <div className="flex flex-col justify-start flex-1 h-full gap-5 overflow-hidden">
          {/* TAB SELECTOR */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className={cn("rounded-full bg-background m-0.5", {
                "ring-2 ring-purple-400": activeTab === 0,
              })}
              onClick={() => setActiveTab(0)}
            >
              Game Details
            </Button>
            <Button
              variant="secondary"
              className={cn("rounded-full bg-background m-0.5", {
                "ring-2 ring-purple-400": activeTab === 1,
              })}
              onClick={() => setActiveTab(1)}
            >
              System Requirements
            </Button>
          </div>
          <SelectedInfoTab selectedTab={activeTab} {...props} />
        </div>
      </div>
    </div>
  );
};

export default InfoTop;
