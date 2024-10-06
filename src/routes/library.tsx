import MainContainer from "@/components/containers/mainContainer";
import { useLanguageContext } from "@/contexts/I18N";
import ContinuePlaying from "@/features/library/components/continuePlaying";
import ListsContainer from "@/features/lists/components/container/listsContainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
  component: Library,
});

function Library() {
  const { t } = useLanguageContext();

  return (
    <MainContainer>
      <div className="flex flex-col w-full h-full gap-10">
        <div className="flex flex-col w-full gap-4">
          <h3 className="pb-2 font-mono text-lg font-medium leading-6">
            {t("continue_playing")}
          </h3>

          <ContinuePlaying />
        </div>

        <ListsContainer />
      </div>
    </MainContainer>
  );
}
