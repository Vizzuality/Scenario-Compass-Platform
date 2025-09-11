import Image from "next/image";
import tapImage from "@/assets/images/tap-image.webp";
import { ComboboxVariableSelect } from "@/components/plots/components/combobox-variable-select";
import { Variable } from "@iiasa/ixmp4-ts";
import { cn } from "@/lib/utils";

interface VariableSelectWrapperProps {
  isLoading?: boolean;
  isError?: boolean;
  isEnabled?: boolean;
  options: Variable[] | undefined;
  onVariableSelect: (variableId: Variable["id"]) => void;
}
export const VariableSelectWrapper = ({
  options,
  isLoading,
  isError,
  isEnabled = true,
  onVariableSelect,
}: VariableSelectWrapperProps) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-100 w-full flex-col items-center justify-center rounded-md border border-dashed bg-white p-4 select-none",
        !isEnabled && "opacity-40",
      )}
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <Image src={tapImage} alt="Tap to select variable" width={120} height={120} />
        <div className="mb-4 space-y-2">
          <strong className="block">Select a variable</strong>
          <p>
            To get started, choose a variable to explore its data through an interactive
            visualization.
          </p>
        </div>
        <ComboboxVariableSelect
          isLoading={isLoading}
          isError={isError}
          options={options}
          onSelectAction={onVariableSelect}
        />
      </div>
    </div>
  );
};
