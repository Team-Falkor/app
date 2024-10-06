import { useLists } from "../../hooks/useLists";
import ListContainer from "./listContainer";

const ListsContainer = () => {
  const { lists } = useLists();

  if (!lists) return null;

  return lists.map((list) => (
    <ListContainer list_id={list.id} list_name={list.name} key={list.id} />
  ));
};

export default ListsContainer;
