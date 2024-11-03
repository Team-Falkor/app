import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ContinuePlayingCard from "../cards/continuePlaying";
import { NewGameCard } from "../cards/newGame";
import NewGameModalContent from "../modals/modal";

const GamesContainer = ({ games }: { games: Record<string, any> }) => {
  return (
    <div className="flex gap-2 overflow-hidden">
      <Dialog>
        <DialogTrigger className="w-[200px] h-full">
          <NewGameCard />
        </DialogTrigger>

        <NewGameModalContent />
      </Dialog>

      <div className="flex-1">
        <Carousel>
          <CarouselContent>
            {Object.values(games).map((game) => (
              <CarouselItem className="basis-auto">
                <ContinuePlayingCard
                  key={game.id}
                  game_name={game.game_name}
                  bg_image={game.game_icon}
                  game_path={game.game_path}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default GamesContainer;
