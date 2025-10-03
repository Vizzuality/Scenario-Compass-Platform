import { Share2 } from "lucide-react";
import BackButton from "@/containers/scenario-dashboard/details/header/back-button";

export default function HeaderTitle() {
  return (
    <>
      <BackButton />
      <div className="mb-12 flex w-full items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-900">Scenario Details</h1>
        <Share2 />
      </div>
    </>
  );
}
