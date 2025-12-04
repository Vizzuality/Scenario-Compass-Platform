import { MembersPictureModule } from "@/containers/about-container/members-picture-module";
import Link from "next/link";

export function MembersSection() {
  return (
    <section className="mx-auto flex w-full items-center justify-center bg-white">
      <div className="container flex flex-col gap-4">
        <MembersPictureModule />
        <div className="flex flex-col gap-4 px-6 pt-16 lg:px-36 xl:px-60">
          <h3 className="text-2xl leading-8 font-bold text-stone-900">Acknowledgements</h3>
          <p>
            The Scenario Compass Initiative is grateful for the generous support from the{" "}
            <Link
              className="underline decoration-1 underline-offset-[1.5px]"
              href="https://www.bezosearthfund.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Bezos Earth Fund.
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
