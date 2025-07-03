import { Navbar } from "@/components/layout/navbar/navbar";

export default function Home() {
  return (
    <div className="grid min-h-screen">
      <main className="flex flex-col">
        <div className="bg-burgundy flex flex-1 flex-col">
          <Navbar
          // theme="dark"
          // sheetTheme={"burgundy"}
          />
          {/* intro modules goes here */}
          <div className="text-center">
            <h1 className="px-4 text-2xl text-white"> Welcome to Scenario Compass Platform</h1>
          </div>
        </div>
        <div className="grid h-screen w-full place-content-center">some div</div>
      </main>
    </div>
  );
}
