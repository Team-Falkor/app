import { SourceProvider } from "@/@types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib";

interface DownloadDialogProvidersProps {
  providers: Array<SourceProvider>;
  selectedProvider: SourceProvider;
  setSelectedProvider: (provider: SourceProvider) => void;
}

const DownloadDialogProviders = ({
  providers,
  selectedProvider,
  setSelectedProvider,
}: DownloadDialogProvidersProps) => {
  return (
    <Carousel>
      <CarouselContent>
        {providers.map((provider, i) => (
          <CarouselItem className="basis-auto relative" key={i}>
            <button
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm bg-muted/50 rounded-lg hover:bg-muted",
                {
                  "bg-muted": selectedProvider.value === provider.value,
                }
              )}
              key={provider.value}
              onClick={() => setSelectedProvider(provider)}
            >
              {provider.label}
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default DownloadDialogProviders;
