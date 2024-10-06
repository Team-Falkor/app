import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/downloads')({
  component: () => <div>Hello /downloads!</div>,
})
