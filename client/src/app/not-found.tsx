import Link from "next/link";
import notFoundImage from "../assets/images/not-found.webp";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen min-w-screen place-content-center bg-white">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start gap-6">
          <h2 className="text-base uppercase">ERRor 404</h2>
          <h1 className="text-5xl font-bold text-slate-900">Page not found</h1>
          <p className="text-lg"> Sorry but the page you are looking for doesn’t exist.</p>
          <Button className="mt-10 flex items-center justify-center">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
        <Image width={500} height={400} alt="This page doesnt exist" src={notFoundImage} />
      </div>
    </div>
  );
}
