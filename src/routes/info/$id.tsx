import IGDBImage from "@/components/IGDBImage";
import { InfoBar } from "@/components/info/infoBar";
import { Button } from "@/components/ui/button";
import { MediaCarousel } from "@/features/library/components/mediaCarousel";
import { igdb } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

export const Route = createFileRoute("/info/$id")({
  component: Info,
});

function Info() {
  const { id } = Route.useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["igdb", "info", id],
    queryFn: async () => await igdb.info(id),
    enabled: !!id,
  });

  if (error) return null;

  return (
    <div className="relative w-full h-full pb-20 overflow-x-hidden max-w-[100vw]">
      {/* TOP BAR */}
      <InfoBar
        titleText={data?.name ?? ""}
        onBack={() => {}}
        onAddToList={() => {}}
      />
      <div className="max-w-[1700px] mx-auto mt-4 px-10">
        <div className="flex h-[30rem]">
          {/* BACKGROUND */}
          <div className="absolute w-full h-[34rem] z-0 bg-cover bg-center bg-no-repeat inset-0 overflow-hidden">
            <IGDBImage
              imageId={
                data?.screenshots?.[0]?.image_id ?? data?.cover?.image_id ?? ""
              }
              alt={data?.name ?? ""}
              className="relative z-0 object-cover w-full h-full overflow-hidden blur-md"
              imageSize="screenshot_big"
            />

            <span className="absolute inset-0 opacity-50 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* LEFT */}
          <div className="relative z-10 flex items-start justify-between w-full gap-4 mb-5">
            {/* CAROUSEL */}
            <div className="w-[36rem]">
              {!isPending && data && (
                <MediaCarousel
                  mainMedia={{
                    alt: data?.name ?? "",
                    media: data?.cover,
                  }}
                  thumbnails={data?.screenshots?.map((screenshot) => ({
                    alt: data?.name ?? "",
                    media: screenshot,
                  }))}
                />
              )}
            </div>

            {/* INFO SECTION (RIGHT) */}
            <div className="flex flex-col justify-start flex-1 h-full gap-4">
              {/* TAB SELECTOR */}
              <div className="flex gap-4">
                <Button variant="secondary" className="bg-background">
                  Game Details
                </Button>
                <Button variant="secondary" className="bg-background">
                  System Requirements
                </Button>
              </div>

              <div className="flex flex-col w-full gap-4 p-4 overflow-hidden rounded-xl bg-background">
                <div className="flex items-center justify-between h-10 overflow-hidden">
                  <div className="flex items-center gap-2 p-2 px-4 text-sm rounded-full bg-secondary/20">
                    <Lightbulb fill="currentColor" size={15} />
                    About this game
                  </div>

                  <div className="flex items-center justify-end flex-1 gap-8">
                    <div className="flex items-center gap-2 p-2 px-4 text-sm rounded-full bg-secondary/20">
                      Rating: 71/100
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-2 p-2 px-4 text-sm rounded-full bg-secondary/20">
                        Action
                      </div>

                      <div className="flex items-center gap-2 p-2 px-4 text-sm rounded-full bg-secondary/20">
                        Platform
                      </div>

                      <div className="flex items-center gap-2 p-2 px-4 text-sm rounded-full bg-secondary/20">
                        Genre
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 px-4 text-sm rounded-full bg-secondary/20">
                      Released: Nov 12, 2024
                    </div>
                  </div>
                </div>
                <p className="w-full text-sm text-muted-foreground text-pretty">
                  {data?.storyline ?? data?.summary ?? ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
