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
    <MainContainer id="main-page" className="w-full overflow-hidden">
      <Carousel id="top-rated-carousel" plugins={[autoplay.current]}>
        <h3
          id="top-rated-heading"
          className="text-lg lg:text-xl xl:text-2xl font-mono font-medium leading-6 flex justify-between items-center mb-5"
        >
          {t("top_rated")}
          <div className="flex space-x-4">
            <CarouselButton direction="left" id="top-rated-left-btn" />
            <CarouselButton direction="right" id="top-rated-right-btn" />
          </div>
        </h3>

        <Banner id="top-rated-banner" />
      </Carousel>

      <div className="space-y-14 mt-16">
        <RowContainer
          id="new-releases-row"
          title={t("new_releases")}
          dataToFetch="newReleases"
        />

        <RowContainer
          id="most-anticipated-row"
          title={t("most_anticipated")}
          dataToFetch="mostAnticipated"
        />
      </div>
    </MainContainer>
  );
}
