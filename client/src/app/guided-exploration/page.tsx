import { Navbar } from "@/components/layout/navbar/navbar";

export default function GuidedExplorationPage() {
  return (
    <div className="grid min-h-screen">
      <main className="flex flex-col">
        <div className="bg-lilac flex flex-1 flex-col">
          <Navbar theme="light" sheetTheme="lilac" />
          <h1 className="pb-20 text-2xl">Guided Exploration</h1>
          <div className="grid h-screen w-full place-content-center bg-white">dumb div</div>
        </div>
      </main>
    </div>
  );
}
