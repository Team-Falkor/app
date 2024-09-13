import { InfoProps } from "@/@types";
import { useLanguageContext } from "@/contexts/I18N";
import { timeSince } from "@/lib";
import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import { useMemo } from "react";
import QuickInfoItem from "./item";

interface QuickInfoProps extends InfoProps {
  isReleased: boolean;
  data: IGDBReturnDataType | undefined;
}

const QuickInfo = (props: QuickInfoProps) => {
  const { t } = useLanguageContext();
  const { isReleased, data } = props;

  const publisher = useMemo(
    () => data?.involved_companies?.find((item) => item.publisher),
    [data]
  );

  const developer = useMemo(
    () => data?.involved_companies?.find((item) => item.developer),
    [data]
  );

  const isSameDevAndPublisher =
    !!developer && !!publisher
      ? developer.developer === publisher.publisher
      : false;

  const releaseDate =
    data?.release_dates?.find((item) => item.platform === 6) ??
    data?.release_dates[0];

  if (!data) return;

  const { genres, aggregated_rating } = data;

  return (
    <section className="overflow-hidden text-sm whitespace-normal text-ellipsis text-slate-400 mt-1">
      <ul className="flex flex-col justify-center gap-2 -mt-1 border-gray-200 divide-gray-200 rounded-lg dark:divide-gray-700 dark:border-gray-700 dark:text-gray-100">
        <QuickInfoItem
          title={t("genres")}
          data={!!genres?.length ? genres : "N/A"}
        />
        <QuickInfoItem
          title={t("rating")}
          data={
            aggregated_rating
              ? `${aggregated_rating.toFixed(0)} / 100`
              : !isReleased
                ? "Not Released"
                : "N/A"
          }
        />
        <QuickInfoItem
          title={t("release_date")}
          data={`${releaseDate?.human} ${
            isReleased && releaseDate?.date
              ? `(${timeSince(releaseDate?.date * 1000)}) `
              : ""
          }`}
        />
        <QuickInfoItem
          title={`${t("developer")} / ${t("publisher")}`}
          data={
            (isSameDevAndPublisher
              ? developer?.company.name
              : `${developer?.company.name ?? "N/A"} / ${publisher?.company.name ?? "N/A"}`) ??
            "N/A"
          }
        />
      </ul>
    </section>
  );
};

export default QuickInfo;
