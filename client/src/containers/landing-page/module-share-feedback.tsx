import Link from "next/link";
import shareFeedbackImg from "@/assets/images/landing-page/module-share-feedback/share-feedback-icon.png";
import { cn } from "@/lib/utils";
import styles from "./index.module.css";
import { Button } from "@/components/ui/button";

export function ModuleShareFeedback() {
  return (
    <div
      className={cn("container grid grid-rows-2 overflow-hidden md:grid-cols-2 md:grid-rows-none")}
    >
      <div
        className={cn(styles.shareFeedbackBackgroundContainer, "order-2 bg-no-repeat md:order-1")}
        style={{
          backgroundImage: `url(${shareFeedbackImg.src})`,
        }}
      />
      <div className={cn("order-1 w-full px-4 pt-16 md:order-2", "md:px-20 md:py-24")}>
        <p className="font-display mb-4 text-center text-4xl leading-10 font-bold text-stone-900">
          Help shape the future of Scenario Compass.
        </p>
        <p className="mb-14 font-sans text-lg leading-7 font-normal text-stone-700">
          Your feedback is invaluable to us! By sharing your thoughts and suggestions, you help us
          improve Scenario Compass. Together, we can build a platform that truly meets your needs.
        </p>
        <Button variant="outline" size="lg" asChild>
          <Link href={""} className="md:w-fit">
            Share feedback
          </Link>
        </Button>
      </div>
    </div>
  );
}
