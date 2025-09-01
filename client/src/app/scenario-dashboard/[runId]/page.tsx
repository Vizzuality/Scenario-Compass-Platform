import ScenarioDetailContainer from "@/containers/scenario-dashboard/scenario-detail";

export default async function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  return <ScenarioDetailContainer runId={runId} />;
}
