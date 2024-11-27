import { ItemDownload, PluginSearchResponse } from "@/@types";
import { ITorrentGameData } from "@/@types/torrent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { openLink } from "@/lib";
import { ITADPrice } from "@/lib/api/itad/types";
import { Download, ShoppingCart } from "lucide-react";

interface SourceShowcaseProps {
  sources: ItemDownload[];
  game_data: ITorrentGameData;
  slug?: string;
}

const SourceShowcase = (props: SourceShowcaseProps) => {
  const { sources, slug } = props;

  return sources?.map((item) => {
    if (item?.id === "itad") {
      return (item?.sources as ITADPrice[])?.map((source) => {
        if (!source?.deals) return null;

        return source?.deals?.map((deal, i) => (
          <CarouselItem
            key={i}
            className="relative overflow-hidden sm:basis-1/2 md:basis-1/2 2xl:basis-1/3"
          >
            <Card className="w-full h-28 p-2.5 overflow-hidden border-none rounded-2xl">
              <div className="flex flex-col items-center justify-between w-full h-full overflow-hidden">
                <div className="flex flex-col">
                  <h1 className="font-bold">{deal.shop.name}</h1>
                </div>

                <p className="w-full text-sm truncate text-muted-foreground">
                  {deal.url}
                </p>

                <Button
                  className="items-center w-full gap-3 text-sm font-bold rounded-full"
                  variant={"secondary"}
                  onClick={() => openLink(deal.url)}
                >
                  <ShoppingCart size={18} fill="currentColor" />
                  {deal.price.currency} {deal.price.amount}
                </Button>
              </div>
            </Card>
          </CarouselItem>
        ));
      });
    } else {
      if (!item?.sources?.length) return null;

      return (item?.sources as PluginSearchResponse[])?.map((source, i) => (
        <CarouselItem
          key={i}
          className="relative overflow-hidden sm:basis-1/2 md:basis-1/2 2xl:basis-1/3"
        >
          <Card className="w-full h-28 p-2.5 overflow-hidden rounded-2xl">
            <div className="flex flex-col items-center justify-between w-full h-full overflow-hidden">
              <h1 className="w-full font-bold line-clamp-2">{source.name}</h1>

              <Button
                className="items-center w-full gap-3 text-sm font-bold rounded-full"
                variant={"secondary"}
              >
                <Download size={18} fill="currentColor" />
                Download
              </Button>
            </div>
          </Card>
        </CarouselItem>
      ));
    }
  });
};

export default SourceShowcase;
