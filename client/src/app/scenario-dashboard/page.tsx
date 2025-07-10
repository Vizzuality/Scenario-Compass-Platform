import { Navbar } from "@/components/layout/navbar/navbar";

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="bg-burgundy w-full">
        <Navbar theme="dark" sheetTheme="burgundy" />
      </div>
      <h1 className="text-2xl font-bold">Dashboard Page</h1>
    </div>
  );
}
