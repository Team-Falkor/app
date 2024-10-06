import MainContainer from '@/components/containers/mainContainer'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLanguageContext } from '@/contexts/I18N'
import SettingTab from '@/features/settings/components/tab'
import { useSettingsTabs } from '@/features/settings/hooks/useSettingsTabs'
import { openLink } from '@/lib'
import { createFileRoute } from '@tanstack/react-router'
import { ReactElement, Suspense, useMemo } from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa6'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

interface LinkItemType {
  icon: ReactElement
  title: string
  url: string
}

const LINKS: Array<LinkItemType> = [
  {
    icon: <FaDiscord />,
    title: 'join_the_discord',
    url: 'https://discord.gg/team-falkor',
  },
  {
    icon: <FaGithub />,
    title: 'star_us_on_github',
    url: 'https://github.com/team-falkor/falkor',
  },
]

function RouteComponent() {
  const { t } = useLanguageContext()
  const { tabs, currentTab, setCurrentTab, ActiveComponent } = useSettingsTabs()

  // Memoize tabs to avoid unnecessary re-renders
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
    [tabs, t, currentTab, setCurrentTab],
  )

  return (
    <MainContainer>
      <div className="flex flex-col md:flex-row justify-between w-full h-[calc(100vh-4rem)] rounded-lg ring-1 ring-muted">
        {/* Sidebar */}
        <div className="flex flex-col h-auto md:h-full border-r w-full md:w-80">
          <div className="p-3 px-4 border-b">
            <h1 className="text-lg md:text-xl font-bold">Settings</h1>
          </div>

          <nav className="flex-1 mt-5 space-y-2 md:space-y-3">
            {settingsTabs}
          </nav>

          <div className="flex justify-end p-3 px-4 border-t mt-auto">
            <div className="flex gap-2 md:gap-1">
              {LINKS.map(({ icon, title, url }) => (
                <Tooltip key={title}>
                  <TooltipTrigger>
                    <Button
                      onClick={() => openLink(url)}
                      variant="ghost"
                      size="icon"
                      className="*:size-5"
                    >
                      {icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t(title)}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
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
    </MainContainer>
  )
}
