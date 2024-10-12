import { igdb } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import DefaultCard from "./cards/defaultCard";
import GenericRowSkeleton from "./skeletons/genericRow";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

interface GenericRowProps {
  dataToFetch: "mostAnticipated" | "topRated" | "newReleases";
  fetchKey: string[];
  className?: string; // Optional className prop for theming
  id?: string; // Optional id for unique identification
}

const GenericRow = ({
  dataToFetch,
  fetchKey,
  className,
  id,
}: GenericRowProps) => {
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
      className={className} // Apply custom className to the Carousel
      id={id} // Apply custom id to the Carousel
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
            id={`carousel-item-${game.id}`} // Add unique id for each carousel item
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
