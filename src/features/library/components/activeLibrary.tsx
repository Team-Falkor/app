import ActiveLibraryGame from "./containers/activeLibraryGame";
import ActiveLibraryList from "./containers/activeLibraryList";
import LibraryHeader from "./header";

type ActiveLibraryProps =
  | {
      title: string;
      type: "game";
    }
  | {
      title: string;
      description?: string;
      type: "list";
      listId: number;
    };

const ActiveLibrary = (props: ActiveLibraryProps) => {
  const { type } = props;

  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg">
      {/* Header */}
      <LibraryHeader {...props} />

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
