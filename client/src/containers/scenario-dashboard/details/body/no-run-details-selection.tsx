import Image from "next/image";
import tapImage from "@/assets/images/tap-image.webp";

export default function NoRunDetailsSelection() {
  return (
    <div className="bg-background flex w-full flex-col items-center py-18">
      <Image src={tapImage} alt="" width={160} />
      <div className="flex w-110 flex-col items-center text-sm text-stone-600">
        <p className="leading-5 font-bold">Start your scenario exploration</p>
        <p className="text-center">
          To get started, please select options in the following order: model, then scenario,
          followed by geography, and finally year. <br /> This step-by-step selection unlocks a
          tailored interactive visualization of your chosen scenario.
        </p>
      </div>
    </div>
  );
}
