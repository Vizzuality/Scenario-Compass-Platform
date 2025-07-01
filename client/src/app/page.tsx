import { Navbar } from "@/components/layout/navbar/navbar";

export default function Home() {
  return (
    <div className="grid min-h-screen">
      <main className="realtive bg-burgundy flex h-full flex-col items-center justify-center pt-21">
        <Navbar theme="burgundy" />
        <h1 className="px-4 pb-20 text-2xl text-white"> Welcome to Scenario Compass Platform</h1>
        <div className="grid h-screen w-full place-content-center bg-white">some div</div>
      </main>
    </div>
  );
}
