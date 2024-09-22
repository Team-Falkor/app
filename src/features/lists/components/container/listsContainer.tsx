import ListContainer from "@/features/lists/components/container/listContainer";
import { useLists } from "@/hooks";

const ListsContainer = () => {
  const { lists } = useLists();

  console.log(lists);

  if (!lists) return null;

  return lists.map((list) => (
    <ListContainer list_id={list.id} list_name={list.name} key={list.id} />
  ));
};

export default ListsContainer;
