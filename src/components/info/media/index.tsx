import { useLanguageContext } from "@/contexts/I18N";
import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import MediaScreenshots from "./screenshots";
import MediaTrailer from "./trailer";

const GameMedia = (props: IGDBReturnDataType) => {
  const { t } = useLanguageContext();
  const { name, screenshots, videos } = props;

  return (
    <div>
      <h1 className="pb-4 text-xl font-medium">{t("media")}</h1>

      <MediaTrailer videos={videos} />

      <MediaScreenshots screenshots={screenshots} name={name} />
    </div>
  );
};

export default GameMedia;
