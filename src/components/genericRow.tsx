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
      <CarouselContent>
        {data?.map((game) => (
          <CarouselItem
            key={game.id}
            className="md:basis-[12%] basis-1/6 2xl:basis-[14.5%] xl:basis-[17.77%]"
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
