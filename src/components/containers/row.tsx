import { useLanguageContext } from "@/contexts/I18N";
import GenericRow from "../genericRow";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface RowContainerProps {
  title: string;
  dataToFetch: "mostAnticipated" | "topRated" | "newReleases";
}

const RowContainer = ({ dataToFetch, title }: RowContainerProps) => {
  const { t } = useLanguageContext();

  return (
    <div className="mx-auto">
      <div className="flex items-center justify-between pt-20 pb-1">
        <h3 className="pb-2 font-mono text-lg font-medium leading-6">
          {title}
        </h3>
        <Button variant="link" className="p-0 m-0 text-sm text-slate-400">
          {t("view_more")}
        </Button>
      </div>

      <Separator orientation="horizontal" className="mb-1.5 bg-primary/80" />

      <GenericRow
        dataToFetch={dataToFetch}
        fetchKey={[title.replace(/\s+/g, "_"), dataToFetch]}
      />
    </div>
  );
};

export default RowContainer;
