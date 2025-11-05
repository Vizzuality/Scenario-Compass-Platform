import ComingSoon from "@/containers/coming-soon-container";
import { Navbar } from "@/components/layout/navbar/navbar";

export default function GuidedExplorationPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar theme="light" sheetTheme="lilac" />
      <ComingSoon />
    </div>
  );
}
