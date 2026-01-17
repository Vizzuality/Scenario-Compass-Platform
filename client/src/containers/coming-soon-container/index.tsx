import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import ComingSoonIllustration from "../../../public/images/coming-soon.svg";
import { Heading } from "@/components/custom/heading";
import { env } from "@/env";

export default function ComingSoon() {
  const isPrelaunch = env.NEXT_PUBLIC_PRE_LAUNCH_MODE;

  return (
    <div className="container mx-auto flex flex-1 items-center">
      <div className="mx-auto grid max-w-[950px] grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-10">
          <Heading as={"h2"} size="4xl">
            Something amazing is on the way.
          </Heading>
          <p>
            We&apos;re working behind the scenes to bring you an experience worth the wait. Stay
            tuned — it&apos;s coming soon.
          </p>
          {!isPrelaunch && (
            <Button asChild className="h-auto px-8 py-4">
              <Link href="/">Go to Homepage</Link>
            </Button>
          )}
        </div>
        <div>
          <Image src={ComingSoonIllustration} alt="cup of coffee - coming soon" priority />
        </div>
      </div>
    </div>
  );
}
