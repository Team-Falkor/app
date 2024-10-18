import { useLanguageContext } from "@/contexts/I18N";
import {
  IGDBReturnDataType,
  IGDBReturnDataTypeCover,
} from "@/lib/api/igdb/types";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import IGDBImage from "../IGDBImage";
import { buttonVariants } from "../ui/button";

const BannerCard = ({
  screenshots: ss,
  cover,
  name,
  summary,
  storyline,
  id,
}: IGDBReturnDataType) => {
  const { t } = useLanguageContext();

  const [screenshots, setScreenshots] = useState<IGDBReturnDataTypeCover[]>();

  const start = 1;
  const howMany = 3;

  useEffect(() => {
    if (screenshots) return;

    const extractedArr = ss?.filter((_item, index) => {
      return index >= start && index < howMany + start;
    });

    setScreenshots(extractedArr);
  }, [howMany, screenshots, ss, start]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg h-80">
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidde">
        <span className="absolute w-full h-full z-[1] from-background to-transparent bg-gradient-to-tr" />
        <IGDBImage
          imageId={cover.image_id}
          className="object-cover w-full h-full"
          alt={name}
        />
      </div>

      <div className="relative z-10 flex flex-col justify-end w-full h-full gap-1 p-4">
        <h1 className="text-2xl font-bold text-white">{name}</h1>
        <p className="text-sm text-slate-300 line-clamp-4">
          {storyline ?? summary ?? "??"}
        </p>
        <div className="flex flex-row justify-end">
          <div className="flex flex-row items-end justify-between w-full">
            <div className="flex flex-row justify-start gap-3 mt-3">
              {screenshots?.map((screenshot) => (
                <IGDBImage
                  imageSize="720p"
                  key={screenshot.id}
                  imageId={screenshot.image_id}
                  className="object-cover rounded-md w-52 aspect-video"
                  alt={name}
                />
              ))}
            </div>

            <div className="flex flex-row gap-3">
              <Link className={buttonVariants({ variant: "secondary" })}>
                {t("trailer")}
              </Link>
              <Link
                className={buttonVariants({ variant: "secondary" })}
                to="/info/$id"
                params={{ id: id.toString() }}
              >
                {t("more_info")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
