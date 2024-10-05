import { InfoProps } from "@/@types";
import { useLanguageContext } from "@/contexts/I18N";
import { IGDBReturnDataType } from "@/lib/api/igdb/types";

const InfoMiddle = ({ storyline, summary }: IGDBReturnDataType & InfoProps) => {
  const { t } = useLanguageContext();

  return (
    <div>
      <section className="mt-5">
        <h1 className="text-xl font-medium">{t("about_this_game")}</h1>
        <p className="pt-2 text-sm text-slate-400">
          {storyline ?? summary ?? "??"}
        </p>
      </section>
    </div>
  );
};

export default InfoMiddle;
