import IGDBImage from "@/components/IGDBImage";
import { IGDBReturnDataTypeCover } from "@/lib/api/igdb/types";
import { useMemo } from "react";

interface MediaScreenshotsProps {
  screenshots: IGDBReturnDataTypeCover[] | undefined;
  name: string;
}

const MediaScreenshots = ({ screenshots: ss, name }: MediaScreenshotsProps) => {
  const screenshots = useMemo(() => {
    return ss?.slice(0, 4);
  }, [ss]);

  if (!screenshots?.length) return null;

  return (
    <div className="flex gap-2 mt-5 overflow-hidden">
      <div className="w-1/2 h-full">
        <IGDBImage
          imageId={screenshots && screenshots[0] ? screenshots[0].image_id : ""}
          alt={name}
          className="object-cover w-full h-full rounded-lg"
        />
      </div>

      <div className="w-1/2">
        <ul className="grid grid-cols-2 gap-2">
          {!!screenshots &&
            screenshots.map((screenshot) => {
              return (
                <li key={screenshot.image_id}>
                  <IGDBImage
                    key={screenshot.image_id}
                    imageId={screenshot.image_id}
                    alt={name}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default MediaScreenshots;
