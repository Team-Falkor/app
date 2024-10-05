import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useCarousel } from "./ui/carousel";

interface CarouselButtonProps {
  direction: "left" | "right";
}

const CarouselButton = ({ direction }: CarouselButtonProps) => {
  const { scrollNext, scrollPrev, canScrollNext, canScrollPrev } =
    useCarousel();

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      onClick={direction === "left" ? scrollPrev : scrollNext}
      disabled={direction === "left" ? !canScrollPrev : !canScrollNext}
    >
      {direction === "left" ? (
        <ChevronLeft className="size-6" />
      ) : (
        <ChevronRight className="size-6" />
      )}
    </Button>
  );
};

export default CarouselButton;
