import { ListGame } from "@/@types";
import { Link } from "@tanstack/react-router";
import IGDBImage from "../IGDBImage";
import { Card, CardContent } from "../ui/card";

type ListCardProps = ListGame;

const ListCard = ({ game_id, title, image }: ListCardProps) => {
  return (
    <Card className="group relative m-0 mt-3 w-[200px] rounded-t-lg p-0 overflow-hidden">
      <CardContent className="p-0 m-0">
        <Link to={`/info/$id`} params={{ id: game_id.toString() }}>
          <div className="relative overflow-hidden rounded-t-lg 2 group focus:outline-none dark:ring-offset-gray-900">
            <IGDBImage
              imageId={
                image ? `https:${image.replace("t_thumb", "t_cover_big")}` : ""
              }
              alt={title}
              className="object-cover w-full transition duration-300 ease-out h-72 group-focus-within:scale-105 group-hover:scale-105 group-focus:scale-105"
            />
          </div>

          {/* <div className="absolute inset-0 z-10 flex items-center justify-center w-full h-full">
          {wantCountdown && !!findReleaseDate?.date && <Countdown date={new Date(findReleaseDate?.date * 1000)} />}
        </div> */}

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center transition duration-300 ease-out translate-y-full rounded opacity-0 cursor-pointer bg-slate-700 bg-opacity-80 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
            <div className="flex flex-col items-center justify-center w-full gap-4 p-2">
              <div className="flex flex-col w-full gap-1">
                <h4 className="font-medium text-center text-white whitespace-pre-line break-before-avoid text-balance">
                  {title}
                </h4>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ListCard;
