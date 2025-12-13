import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  currentVariable: string;
  options: readonly string[];
  onChange: (variable: string) => void;
}

export function VariableSelect({ options, currentVariable, onChange }: Props) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <p className="text-xs">Variable</p>
      <Select onValueChange={onChange} value={currentVariable}>
        <SelectTrigger size="sm" className="w-fit max-w-4/5">
          <SelectValue className="truncate" placeholder="Select variable..." />
        </SelectTrigger>
        <SelectContent className="max-h-100">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option.replaceAll("|", " - ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
