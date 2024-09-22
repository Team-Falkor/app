import MainContainer from "@/components/containers/mainContainer";
import ListsContainer from "@/features/lists/components/container/listsContainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
  component: Library,
});

function Library() {
  return (
    <MainContainer>
      <div className="flex flex-col w-full h-full gap-10">
        <ListsContainer />
      </div>
    </MainContainer>
  );
}
