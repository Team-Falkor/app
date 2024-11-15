import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import MediaTrailer from "../info/media/trailer";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type Props = Pick<IGDBReturnDataType, "name" | "videos">;

const TrailerDialogContent = ({ name, videos }: Props) => {
  return (
    <DialogContent className="w-full max-w-[45rem] overflow-hidden p-4">
      <DialogHeader>
        <DialogTitle className="text-lg line-clamp-2">{name}</DialogTitle>
      </DialogHeader>
      <div className="relative w-full rounded-md aspect-video">
        <MediaTrailer videos={videos} className="w-full h-full" />
      </div>
    </DialogContent>
  );
};

export default TrailerDialogContent;
