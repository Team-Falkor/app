import { useLanguageContext } from "@/contexts/I18N";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

import Banner from "@/components/banner";
import CarouselButton from "@/components/carouselButton";
import MainContainer from "@/components/containers/mainContainer";
import RowContainer from "@/components/containers/row";
import { Carousel } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const Route = createLazyFileRoute("/")({
  component: Index,
});
function Index() {
  const { t } = useLanguageContext();
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <MainContainer>
      <Carousel
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        <h3 className="pb-2 font-mono text-lg font-medium leading-6 flex justify-between items-center mb-2">
          {t("top_rated")}
          <div>
            <CarouselButton direction="left" />
            <CarouselButton direction="right" />
          </div>
        </h3>

        <Banner />
      </Carousel>

      <RowContainer title={t("new_releases")} dataToFetch="newReleases" />

      <RowContainer
        title={t("most_anticipated")}
        dataToFetch="mostAnticipated"
      />
    </MainContainer>
  );
}
