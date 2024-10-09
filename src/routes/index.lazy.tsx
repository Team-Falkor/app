import Banner from "@/components/banner";
import CarouselButton from "@/components/carouselButton";
import MainContainer from "@/components/containers/mainContainer";
import RowContainer from "@/components/containers/row";
import { Carousel } from "@/components/ui/carousel";
import { useLanguageContext } from "@/contexts/I18N";
import { createLazyFileRoute } from "@tanstack/react-router";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useLanguageContext();
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <MainContainer>
      <Carousel plugins={[autoplay.current]}>
        <h3 className="pb-2 text-lg lg:text-xl xl:text-2xl font-mono font-medium leading-6 flex justify-between items-center mb-4">
          {t("top_rated")}
          <div className="flex space-x-4">
            <CarouselButton direction="left" />
            <CarouselButton direction="right" />
          </div>
        </h3>

        <Banner className="h-64 lg:h-80 xl:h-96" />
      </Carousel>

      <RowContainer title={t("new_releases")} dataToFetch="newReleases" />

      <RowContainer
        title={t("most_anticipated")}
        dataToFetch="mostAnticipated"
        className="mb-8"
      />
    </MainContainer>
  );
}
