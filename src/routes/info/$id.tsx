import IGDBImage from "@/components/IGDBImage";
import InfoBottom from "@/components/info/bottom";
import InfoMiddle from "@/components/info/middle";
import InfoTop from "@/components/info/top";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserCountry, igdb, itad } from "@/lib";
import { goBack } from "@/lib/history";
import { Mapping } from "@/lib/mapping";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

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

  const releaseDate = data
    ? (data.release_dates?.find((item) => item.platform === 6) ??
      data.release_dates?.[0])
    : null;
  const isReleased = !releaseDate
    ? false
    : !releaseDate?.date || releaseDate.date < Date.now() / 1000;

  const itadQuery = useQuery({
    queryKey: ["itad", "prices", id],
    queryFn: async () => {
      if (!data) return;

      const itadSearch = await itad.gameSearch(data?.name);
      const mapping = new Mapping<any>(data?.name, itadSearch);
      const result = await mapping.compare();

      if (result) {
        const local = await getUserCountry();
        const itadPrices = await itad.gamePrices([result.id], local);
        return itadPrices;
      }
    },
    enabled: !!id && isReleased,
  });

  if (error) return null;

  return (
    <div className="relative w-full h-full pb-20 overflow-x-hidden max-w-[100vw]">
      <div className="absolute top-0 left-0 z-10 flex w-full mx-10 mt-3">
        <Button variant="ghost" size="icon" onClick={() => goBack()}>
          <ChevronLeft />
        </Button>
      </div>

      <div>
        {isPending ? (
          <Skeleton className="w-full rounded-lg h-96" />
        ) : (
          <div className="sticky top-0 left-0 right-0 w-full overflow-hidden rounded-b-lg h-96">
            <IGDBImage
              imageId={
                data?.screenshots?.[0]?.image_id ?? data?.cover?.image_id ?? ""
              }
              alt={data?.name}
              className="relative z-0 object-cover w-full h-full overflow-hidden"
              imageSize="screenshot_big"
            />

            <span className="absolute inset-0 opacity-50 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-screen-xl px-4 mx-auto xl:max-w-7xl sm:px-6 lg:px-8">
        <InfoTop
          data={data}
          isReleased={isReleased}
          error={error}
          isPending={isPending}
          itadData={itadQuery.data}
          itadError={itadQuery.error}
          itadPending={itadQuery.isPending}
        />

        {!isPending && (
          <>
            <InfoMiddle {...data} error={error} isPending={isPending} />

            <InfoBottom {...data} error={error} isPending={isPending} />
          </>
        )}
      </div>
    </div>
  );
}
