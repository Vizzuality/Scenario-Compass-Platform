import { Navbar } from "@/components/layout/navbar/navbar";

export default function GuidedExplorationPage() {
  return (
    <div className="grid min-h-screen">
      <main className="realtive bg-lilac flex h-full flex-col items-center justify-center pt-21">
        <Navbar theme="lilac" />
        <h1 className="pb-20 text-2xl">Guided Exploration</h1>
        <div className="grid h-screen w-full place-content-center bg-white">dumb div</div>
      </main>
    </div>
  );
}
