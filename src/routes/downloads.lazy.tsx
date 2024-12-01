import { DownloadData } from '@/@types'
import { ITorrent } from '@/@types/torrent'
import FolderButton from '@/components/folderButton'
import { useLanguageContext } from '@/contexts/I18N'
import DownloadCard from '@/features/downloads/components/cards/download'
import { DownloadCardLoading } from '@/features/downloads/components/cards/loading'
import UseDownloads from '@/features/downloads/hooks/useDownloads'
import { useMapState } from '@/hooks'
import { isTorrent } from '@/lib'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo } from 'react'

export const Route = createLazyFileRoute('/downloads')({
  component: Downloads,
})

function Downloads() {
  const { t } = useLanguageContext()
  const { downloading, getQueue, fetchDownloads } = UseDownloads()
  const {
    map: statsMap,
    set: setStats,
    remove: removeStats,
  } = useMapState<string, ITorrent | DownloadData>()

  // Retrieve the current download queue once per render
  const queue = useMemo(getQueue, [getQueue])

  useEffect(() => {
    fetchDownloads()
  }, [fetchDownloads])

  const handleProgress = useCallback(
    (_event: any, data: ITorrent | DownloadData) => {
      if (isTorrent(data)) {
        setStats(data.infoHash, data)
      } else {
        setStats(data.id, data)
      }
    },
    [setStats],
  )

  // Register progress event listener
  useEffect(() => {
    const ipcRenderer = window.ipcRenderer
    ipcRenderer.on('torrent:progress', handleProgress)
    ipcRenderer.on('download:progress', handleProgress)
    ipcRenderer.on('download:complete', handleProgress)
    ipcRenderer.on('download:paused', handleProgress)

    return () => {
      ipcRenderer.removeAllListeners('torrent:progress')
      ipcRenderer.removeAllListeners('download:progress')
      ipcRenderer.removeAllListeners('download:complete')
      ipcRenderer.removeAllListeners('download:paused')
    }
  }, [handleProgress])

  // Combine downloading and queue, removing duplicates by ID/infoHash
  const uniqueDownloads = useMemo(() => {
    const uniqueSet = new Map<string, ITorrent | DownloadData>()

    downloading?.forEach((item) => {
      const key = isTorrent(item) ? item.infoHash : item.id
      uniqueSet.set(key, item)
    })

    queue.forEach((item) => {
      const key = isTorrent(item) ? item.infoHash : item.id
      if (!uniqueSet.has(key)) {
        uniqueSet.set(key, item)
      }
    })

    return Array.from(uniqueSet.values())
  }, [downloading, queue])

  const renderDownloadCard = useCallback(
    (item: ITorrent | DownloadData) => {
      const stats =
        statsMap?.get(isTorrent(item) ? item.infoHash : item.id) ?? item

      // if ((stats && stats.status === "stopped") || stats?.status === "error")
      //   return null;
      if (stats?.status === 'pending') return <DownloadCardLoading />
      if (isTorrent(item))
        return (
          <DownloadCard
            key={item.infoHash}
            stats={stats}
            deleteStats={removeStats}
          />
        )
      return (
        <DownloadCard key={item.id} stats={stats} deleteStats={removeStats} />
      )
    },
    [removeStats, statsMap],
  )

  return (
    <div className="w-full h-full flex flex-col">
      {/* ACTION BAR */}
      <div className="w-full flex justify-between flex-row bg-background/50 border-b mb-5 p-4 py-2.5">
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">
            {t('sections.downloads')}
          </h1>
        </div>

        <div>
          <FolderButton
            path="downloads"
            tooltip={t('open_downloads_folder')}
            variant={'secondary'}
          />
        </div>
      </div>

      {uniqueDownloads.length ? (
        <div className=" mt-2 flex flex-col gap-4">
          {uniqueDownloads.map(renderDownloadCard)}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center h-60 bg-muted/50">
          <h1 className="text-xl font-bold text-foreground">
            {t('no_downloads_in_progress')}
          </h1>
        </div>
      )}
    </div>
  )
}

export default Downloads
