import { Section } from "@/components/containers/section";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sections/newReleases")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Section title="New Releases" dataToFetch="newReleases" />;
}
