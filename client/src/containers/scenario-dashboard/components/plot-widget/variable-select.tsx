import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

interface Props {
  currentVariable: string;
  options: readonly string[];
  onChange: (variable: string) => void;
}

export function VariableSelect({ options, currentVariable, onChange }: Props) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <p className="text-xs">Variable</p>
      <Select onValueChange={onChange}>
        <SelectTrigger size="sm">{currentVariable}</SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
