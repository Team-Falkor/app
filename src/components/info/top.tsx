import { InfoItadProps, InfoProps } from "@/@types";
import { cn } from "@/lib";
import { IGDBReturnDataType, ReleaseDate } from "@/lib/api/igdb/types";
import { format } from "date-fns";
import { Lightbulb } from "lucide-react";
import { useMemo, useState } from "react";
import IGDBImage from "../IGDBImage";
import InfoTopSkeleton from "../skeletons/info/top.skeleton";
import Stars from "../starts";
import { Button } from "../ui/button";
import Sources from "./sources";

type InfoTopProps = InfoProps & {
  data: IGDBReturnDataType | undefined;
  isReleased: boolean;
  releaseDate: ReleaseDate | null | undefined;
  // playingData: LibraryGame | null | undefined;
  // playingPending: boolean;
};

type Props = InfoTopProps & InfoItadProps;

const InfoTop = (props: Props) => {
  const {
    data,
    isReleased,
    isPending,
    error,
    itadData,
    itadError,
    itadPending,
    releaseDate,
  } = props;
  const [activeTab, setActiveTab] = useState<number>(0);

  // const steam_id = useMemo(
  //   () => getSteamIdFromWebsites(data?.websites ?? []),
  //   [data?.websites]
  // );

  const genres = useMemo(
    () =>
      data?.genres?.slice(0, 2)?.map((item) => ({
        ...item,
        name: item?.name?.split("(")?.[0]?.trim() ?? "",
      })) ?? [],
    [data?.genres]
  );

  const publisher = useMemo(
    () => data?.involved_companies?.find((item) => item.publisher),
    [data]
  );

  const developer = useMemo(
    () => data?.involved_companies?.find((item) => item.developer),
    [data]
  );

  const isSameDevAndPublisher =
    !!developer && !!publisher
      ? developer?.company?.name.toLowerCase() ===
        publisher?.company?.name?.toLowerCase()
      : false;

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
        {/* CAROUSEL */}
        {/* LEFT */}
        <div className="xl:w-[36%] w2/6 h-full overflow-hidden rounded-2xl">
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

          <div className="flex flex-col flex-shrink-0 w-full gap-2 p-4 overflow-hidden h-52 rounded-2xl bg-background">
            <div className="flex items-center justify-between h-10 overflow-hidden">
              <div className="flex items-center gap-2 p-2.5 text-sm rounded-full bg-secondary/20 font-semibold flex-shrink-0 flex-grow-0">
                <Lightbulb fill="currentColor" size={15} />
                About this game
              </div>

              <div className="flex items-center justify-end flex-1 gap-7">
                {!!isReleased && (data?.aggregated_rating ?? 0) > 0 && (
                  <div className="flex items-center gap-2 p-2.5 text-sm rounded-full bg-secondary/20 font-semibold">
                    <Stars stars={(data?.aggregated_rating ?? 0) / 10} />
                  </div>
                )}

                <div className="flex items-center gap-2 p-2.5  text-sm rounded-full bg-secondary/20 font-semibold">
                  {!isReleased
                    ? "Coming Soon"
                    : !releaseDate?.date
                      ? "N/A"
                      : format(releaseDate.date * 1000, "MMM d, yyyy")}
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {isSameDevAndPublisher ? (
                  <div
                    key={publisher?.company?.id}
                    className="flex items-center gap-2 p-2.5 text-sm rounded-full bg-secondary/20 font-semibold truncate"
                  >
                    {developer?.company?.name ?? "N/A"}
                  </div>
                ) : (
                  <>
                    <div
                      key={publisher?.company?.id}
                      className="flex items-center gap-2 p-2.5 text-sm rounded-full bg-secondary/20 font-semibold truncate"
                    >
                      {publisher?.company?.name ?? "N/A"}
                    </div>
                    <div
                      key={developer?.company?.id}
                      className="flex items-center gap-2 p-2.5 text-sm rounded-full bg-secondary/20 font-semibold truncate"
                    >
                      {developer?.company?.name ?? "N/A"}
                    </div>
                  </>
                )}
              </div>

              {!!genres && (
                <div className="flex items-center gap-1.5">
                  {genres.map((genre) => (
                    <div
                      key={genre.slug}
                      className="flex items-center gap-2 p-2.5 text-sm rounded-full bg-secondary/20 font-semibold truncate"
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="-mt-1 text-sm text-muted-foreground text-pretty line-clamp-4">
              {data?.storyline ?? data?.summary ?? ""}
            </p>
          </div>

          {!isPending && data && (
            <div className="">
              <Sources
                title={data?.name}
                isReleased={isReleased}
                websites={data?.websites}
                slug={data?.slug}
                itadData={itadData}
                itadError={itadError}
                itadPending={itadPending}
                game_data={{
                  banner_id: data.screenshots?.[0].image_id,
                  id: data.id,
                  image_id: data.cover?.image_id,
                  name: data.name,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoTop;
