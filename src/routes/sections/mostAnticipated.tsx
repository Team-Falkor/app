import { Section } from "@/components/containers/section";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sections/mostAnticipated")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Section title="Most Anticipated" dataToFetch="mostAnticipated" />;
}
