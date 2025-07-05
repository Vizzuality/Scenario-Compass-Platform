import Link from "next/link";
import shareFeedbackImg from "@/assets/images/ilustrations/ilustration_06.png";
import { cn } from "@/lib/utils";
import styles from "./index.module.css";
import { Button } from "@/components/ui/button";
import { BodyText, Title2 } from "@/components/custom/typography";

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
      <div className={cn("order-1 w-full px-4 pt-16", "md:order-2 md:px-20 md:py-24")}>
        <Title2 className="mb-4 text-center">Help shape the future of Scenario Compass.</Title2>
        <BodyText className="mb-10 text-center">
          Your feedback is invaluable to us! By sharing your thoughts and suggestions, you help us
          improve Scenario Compass. Together, we can build a platform that truly meets your needs.
        </BodyText>
        <Button variant="outline" size="lg" asChild>
          <Link href={""} className="w-full md:w-fit">
            Share feedback
          </Link>
        </Button>
      </div>
    </div>
  );
}
