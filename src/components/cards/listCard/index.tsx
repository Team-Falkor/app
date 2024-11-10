import { ListGame } from "@/@types";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import ListCardImage from "./image";
import ListCardOverlay from "./overlay";

type ListCardProps = ListGame;

const ListCard: React.FC<ListCardProps> = ({ game_id, title, image }) => {
  const imageId = image
    ? `https:${image.replace("t_thumb", "t_cover_big")}`
    : "";

  return (
    <Card className="group relative m-0 mt-3 w-[200px] rounded-t-lg p-0 overflow-hidden">
      <CardContent className="p-0 m-0">
        <Link to={`/info/$id`} params={{ id: game_id.toString() }}>
          <ListCardImage imageId={imageId} alt={title} />
          <ListCardOverlay title={title} />
        </Link>
      </CardContent>
    </Card>
  );
};

export default ListCard;
