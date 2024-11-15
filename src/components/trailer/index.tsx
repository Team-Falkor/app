import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import TrailerDialogContent from "./dialogContent";

type Props = Pick<IGDBReturnDataType, "name" | "videos">;

const TrailerButton = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">Trailer</Button>
      </DialogTrigger>

      <TrailerDialogContent {...props} />
    </Dialog>
  );
};

export default TrailerButton;
