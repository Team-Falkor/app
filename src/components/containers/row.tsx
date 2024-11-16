import { useLanguageContext } from "@/contexts/I18N";
import { cn } from "@/lib";
import { Link } from "@tanstack/react-router";
import { HTMLAttributes } from "react";
import GenericRow from "../genericRow";
import { buttonVariants } from "../ui/button";

interface RowContainerProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  dataToFetch: "mostAnticipated" | "topRated" | "newReleases";
  id?: string; // Added optional id prop
}

const RowContainer = ({
  dataToFetch,
  title,
  className,
  id,
  ...props
}: RowContainerProps) => {
  const { t } = useLanguageContext();

  return (
    <div className={cn("mx-auto", className)} id={id} {...props}>
      <div className="flex items-center justify-between pb-1">
        <h3 className="pb-2 font-mono text-lg font-medium leading-6">
          {title}
        </h3>

        <Link
          to={`/sections/${dataToFetch}`}
          className={cn(
            buttonVariants({
              variant: "link",
            }),
            "p-0 m-0 text-sm text-slate-400"
          )}
        >
          {t("view_more")}
        </Link>
      </div>

      {/* <Separator
        orientation="horizontal"
        className="mb-3.5 bg-muted-foreground/25"
      /> */}

      <GenericRow
        className="mt-2"
        dataToFetch={dataToFetch}
        fetchKey={[dataToFetch]}
      />
    </div>
  );
};

export default RowContainer;
