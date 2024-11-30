import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGames } from "@/features/library/hooks/useGames";
import { useMemo } from "react";
import NavBarContinuePlayingCard from "../cards/playing";

export const NavBarMiddle = () => {
  const { games } = useGames(true);

  const gamesToShow = useMemo(() => {
    const gamesArray = Object.values(games);
    if (!gamesArray?.length) return [];
    gamesArray.sort(
      (a, b) => Number(b.game_last_played) - Number(a.game_last_played)
    );
    return gamesArray.slice(0, 5);
  }, [games]);

  if (!Object.values(games)?.length) return null;

  return (
    <div>
      <Carousel
        orientation="vertical"
        opts={{
          skipSnaps: true,
          dragFree: true,
          loop: false,
        }}
      >
        <CarouselContent>
          {...gamesToShow.map((game) => {
            return (
              <CarouselItem key={game.id}>
                <NavBarContinuePlayingCard {...game} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
