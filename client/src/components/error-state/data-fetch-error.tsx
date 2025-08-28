import { cn } from "@/lib/utils";
import Image from "next/image";
import errorImage from "@/assets/images/error.png";
interface Props {
  className?: string;
}

export const DataFetchError = ({ className }: Props) => {
  return (
    <div className={cn(className, "flex flex-col items-center justify-center p-4")}>
      <Image
        src={errorImage}
        height={200}
        width={200}
        alt="Image displaying the error state of a component"
      />
      <strong>Unable to load data</strong>
      <p className="text-center">
        The application was unable to retrieve the requested data. This may be due to a network
        issue or a temporary issue on our end. Please try again later.
      </p>
    </div>
  );
};
