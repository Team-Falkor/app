import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import { Link } from "@tanstack/react-router";

const SearchCard = ({
  name,
  id,
  setOpen,
}: IGDBReturnDataType & {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Link
      className="w-full px-6 py-2 border-b rounded-md cursor-default select-none hover:cursor-pointer hover:text-white"
      key={1}
      to={`/info/${id}`}
      onClick={() => setOpen(false)}
    >
      <p className="text-sm line-clamp-2">{name}</p>
    </Link>
  );
};

export default SearchCard;
