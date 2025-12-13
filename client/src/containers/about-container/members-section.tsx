import { MembersPictureModule } from "@/containers/about-container/members-picture-module";
import Link from "next/link";

export function MembersSection() {
  return (
    <section className="mx-auto flex w-full items-center justify-center bg-white">
      <div className="flex flex-col gap-6">
        <div className="content-container">
          <h3 className="mx-auto max-w-[846px] text-2xl leading-8 font-bold text-stone-900">
            Meet the SCI-team
          </h3>
        </div>
        <MembersPictureModule />
        <div className="content-container">
          <div className="mx-auto flex max-w-[846px] flex-col gap-4 pt-12">
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
      </div>
    </section>
  );
}
