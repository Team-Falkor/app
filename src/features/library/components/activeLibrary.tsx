import { Book, Play } from "lucide-react";
import ActiveLibraryGame from "./containers/activeLibraryGame";
import ActiveLibraryList from "./containers/activeLibraryList";

type ActiveLibraryProps =
  | {
      title: string;
      type: "game";
    }
  | {
      title: string;
      type: "list";
      listId: number;
    };

const ActiveLibrary = (props: ActiveLibraryProps) => {
  const { type, title } = props;

  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3">
        {type === "game" ? (
          <Play size={36} className="text-primary fill-white" />
        ) : (
          <Book size={36} className="text-primary" />
        )}
        <h2 className="text-2xl font-bold capitalize">{title}</h2>
      </div>

      {/* Content */}
      <div className="flex flex-wrap gap-6 px-2 py-4">
        {type === "game" ? (
          <ActiveLibraryGame />
        ) : type === "list" ? (
          <ActiveLibraryList listId={props.listId} />
        ) : (
          <div>Unknown type</div>
        )}
      </div>
    </div>
  );
};

export default ActiveLibrary;
