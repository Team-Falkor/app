import { igdb } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import BannerCard from "../cards/bannerCard";
import BannerSkeleton from "../skeletons/banner";
import { CarouselContent, CarouselItem } from "../ui/carousel";

const Banner = () => {
  const fetch = async () => {
    const data = await igdb.topRated();
    return data;
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["igdb", "Banner"],
    queryFn: fetch,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isPending) return <BannerSkeleton />;

  if (error) return <div>Error</div>;

  return (
    <div className="w-full">
      <CarouselContent>
        {data?.map((game) => (
          <CarouselItem key={game.id}>
            <BannerCard {...game} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </div>
  );
};

export default Banner;
