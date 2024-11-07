import Spinner from "@/components/spinner";
import { useLanguageContext } from "@/contexts/I18N";
import SettingsSidebar from "@/features/settings/components/sidebar";
import SettingTab from "@/features/settings/components/tab";
import { useSettingsTabs } from "@/features/settings/hooks/useSettingsTabs";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useMemo } from "react";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLanguageContext();
  const { tabs, currentTab, setCurrentTab, ActiveComponent } =
    useSettingsTabs();

  const settingsTabs = useMemo(
    () =>
      tabs.map(({ icon, titleKey, index }) => (
        <SettingTab
          key={index}
          icon={icon}
          title={t(titleKey)}
          isActive={currentTab === index}
          onClick={() => setCurrentTab(index)}
        />
      )),
    [tabs, t, currentTab, setCurrentTab]
  );

  return (
    <div className="flex flex-col md:flex-row justify-between w-full h-screen animate-slide-in">
      {/* Sidebar with tabs and links */}
      <SettingsSidebar settingsTabs={settingsTabs} />

      {/* Content area */}
      <div className="flex flex-col w-full h-full overflow-hidden">
        <Suspense
          fallback={
            <div className="size-full flex items-center justify-center">
              <Spinner size={23} />
            </div>
          }
        >
          {ActiveComponent && <ActiveComponent />}
        </Suspense>
      </div>
    </div>
  );
}
