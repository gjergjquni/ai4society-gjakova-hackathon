import type { Metadata } from "next";
import DirectorateDashboard from "@/components/drejtoria/directorate-dashboard";
import DirectorateNotFound from "@/components/drejtoria/not-found";
import { getDirectorateByRouteId } from "@/lib/directorates";

type Props = {
  params: Promise<{ routeId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { routeId } = await params;
  const id = Number(routeId);
  const directorate = getDirectorateByRouteId(id);
  return {
    title: directorate
      ? `${directorate.name} · ReagoGjakovë`
      : "Drejtoria nuk u gjet · ReagoGjakovë",
    robots: { index: false, follow: false },
  };
}

export default async function DrejtoriaPage({ params }: Props) {
  const { routeId } = await params;
  const id = Number(routeId);

  if (!Number.isInteger(id) || id < 1 || id > 13) {
    return <DirectorateNotFound routeId={routeId} />;
  }

  const directorate = getDirectorateByRouteId(id)!;
  return <DirectorateDashboard directorate={directorate} />;
}
