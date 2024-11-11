import DefaultCard from "@/components/cards/defaultCard";
import CarouselButton from "@/components/carouselButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useLanguageContext } from "@/contexts/I18N";
import { FilterOutNonePcGames } from "@/lib";
import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import { useMemo } from "react";

interface SimilarGamesProps {
  data: IGDBReturnDataType["similar_games"];
}

const SimilarGames = ({ data }: SimilarGamesProps) => {
  const { t } = useLanguageContext();

  const items = useMemo(() => FilterOutNonePcGames(data), [data]);

  if (!items?.length) return null;

  return (
    <div>
      <Carousel
        opts={{
          skipSnaps: true,
          dragFree: true,
        }}
        className="w-full"
      >
        <div className="flex justify-between">
          <h1 className="text-xl font-medium capitalize">
            {t("you_may_also_like")}
          </h1>
          <div>
            <CarouselButton direction="left" />
            <CarouselButton direction="right" />
          </div>
        </div>

        <CarouselContent>
          {items.map((game) => (
            <CarouselItem key={game.id} className="px-2 basis-auto">
              <DefaultCard key={game.id} {...game} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default SimilarGames;
