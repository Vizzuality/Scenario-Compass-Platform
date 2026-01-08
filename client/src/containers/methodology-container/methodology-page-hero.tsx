import { Navbar } from "@/components/layout/navbar/navbar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

export default function MethodologyPageHero({ children }: Props) {
  return (
    <div
      className={cn(
        "bg-lilac relative flex h-full w-full flex-col items-center justify-center overflow-hidden",
      )}
    >
      <Navbar theme="light" sheetTheme="burgundy" />
      <div className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full items-center justify-center lg:flex">
        <div className="container mx-auto flex h-full w-full items-end justify-end">
          <Image
            src="/images/about-page/Illustration-02.webp"
            alt=""
            height={1365}
            width={2941}
            className="h-full w-auto scale-x-[-1] object-contain"
            priority
            quality={100}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
