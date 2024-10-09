import { igdb } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import DefaultCard from "./cards/defaultCard";
import GenericRowSkeleton from "./skeletons/genericRow";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

interface GenericRowProps {
  dataToFetch: "mostAnticipated" | "topRated" | "newReleases";
  fetchKey: string[];
}

const GenericRow = ({ dataToFetch, fetchKey }: GenericRowProps) => {
  const fetcher = async () => {
    const data = await igdb[dataToFetch]();
    return data;
  };

  const { data, isPending, error } = useQuery({
    queryKey: fetchKey,
    queryFn: fetcher,
  });

  if (isPending) return <GenericRowSkeleton />;
  if (error) return null;

  return (
    <Carousel
      opts={{
        skipSnaps: true,
      }}
    >
      <CarouselContent className="px-3">
        {data?.map((game) => (
          <CarouselItem
            key={game.id}
            className="
              basis-1/2
              sm:basis-1/3
              md:basis-1/4
              lg:basis-1/5
              xl:basis-[17.77%]
              2xl:basis-[13.5%]
              px-2
            "
          >
            <DefaultCard
              key={game.id}
              wantCountdown={dataToFetch === "mostAnticipated"}
              {...game}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default GenericRow;
