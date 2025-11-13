import { cn } from "@/lib/utils";
import Image from "next/image";
import errorImage from "@/assets/images/warning.webp";

interface DataFetchErrorProps {
  className?: string;
  children?: React.ReactNode;
}

export const DataFetchError = ({ className, children }: DataFetchErrorProps) => {
  const defaultContent = (
    <>
      <strong>Unable to load data</strong>
      <p className="text-center">
        The application was unable to retrieve the requested data.
        <br />
        Please try refreshing the page.
      </p>
    </>
  );

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 p-4", className)}>
      <Image src={errorImage} height={200} width={200} alt="Error state illustration" priority />
      {children ?? defaultContent}
    </div>
  );
};
