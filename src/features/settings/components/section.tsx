import { useLanguageContext } from "@/contexts/I18N";
import { PropsWithChildren } from "react";

interface Props {
  title?: string;
}

export const SettingsSection = ({
  children,
  title,
}: PropsWithChildren<Props>) => {
  const { t } = useLanguageContext();

  return (
    <div className="p-4 space-y-5 bg-white rounded-lg shadow-md dark:bg-card/40">
      {!!title && (
        <h2 className="text-xl font-semibold ">
          <span>{t("settings.settings." + title)}</span>
        </h2>
      )}
      {children}
    </div>
  );
};
