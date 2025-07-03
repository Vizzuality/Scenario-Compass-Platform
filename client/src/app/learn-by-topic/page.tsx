import { Navbar } from "@/components/layout/navbar/navbar";

export default function LearnByTopicPage() {
  return (
    <div className="grid min-h-screen">
      <main className="flex flex-col">
        <div className="flex flex-1 flex-col bg-white">
          <Navbar theme="light" sheetTheme="white" />
          <h1 className="p-5 text-2xl">Learn by topic</h1>
          <div className="bg-beige-dark grid h-screen w-full place-content-center">some div</div>
        </div>
      </main>
    </div>
  );
}
