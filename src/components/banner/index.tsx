import { cn, igdb } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { HTMLAttributes } from "react";
import BannerCard from "../cards/bannerCard";
import BannerSkeleton from "../skeletons/banner";
import { CarouselContent, CarouselItem } from "../ui/carousel";

type Props = HTMLAttributes<HTMLDivElement>;

const Banner = ({ className, ...props }: Props) => {
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

  console.log(data);

  if (isPending) return <BannerSkeleton />;

  if (error) return <div>Error</div>;

  return (
    <div className={cn("w-full", className)} {...props}>
      <CarouselContent>
        {!!data?.length &&
          data?.map((game) => (
            <CarouselItem key={game.id}>
              <BannerCard {...game} />
            </CarouselItem>
          ))}
      </CarouselContent>
    </div>
  );
};

export default Banner;
