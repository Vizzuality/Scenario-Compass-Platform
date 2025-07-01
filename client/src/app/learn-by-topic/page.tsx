import { Navbar } from "@/components/layout/navbar/navbar";

export default function LearnByTopicPage() {
  return (
    <div className="grid min-h-screen">
      <main className="realtive flex h-full flex-col items-center justify-center bg-white pt-21">
        <Navbar theme="default" />
        <h1 className="p-5 text-2xl">Learn by topic</h1>
        <div className="bg-beige-dark grid h-screen w-full place-content-center">some div</div>
      </main>
    </div>
  );
}
