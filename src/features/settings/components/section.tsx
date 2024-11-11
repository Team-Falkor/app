import { useLanguageContext } from "@/contexts/I18N";
import { PropsWithChildren } from "react";

interface Props {
  title?: string;
  description?: string;
}

export const SettingsSection = ({
  children,
  title,
  description,
}: PropsWithChildren<Props>) => {
  const { t } = useLanguageContext();

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-md dark:bg-card/40">
      <div className="flex flex-col">
        {!!title && (
          <h2 className="text-xl font-semibold">
            <span>{t("settings.settings." + title)}</span>
          </h2>
        )}
        {!!description && (
          <p className="text-sm text-muted-foreground">
            {t("settings.settings." + description)}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};
