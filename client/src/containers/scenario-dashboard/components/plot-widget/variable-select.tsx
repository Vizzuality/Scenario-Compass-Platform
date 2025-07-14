import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { Variable } from "@iiasa/ixmp4-ts";

interface Props {
  variable: string;
}

export function VariableSelect({ variable }: Props) {
  const { data, isLoading, isError } = useQuery({
    ...queryKeys.variables.list({
      // @ts-expect-error Not sufficient TS support
      name_like: `*${variable}*`,
    }),
  });

  return (
    <div className="mb-5 flex items-center gap-2.5">
      <p className="text-xs">Variable</p>
      <Select>
        <SelectTrigger size="sm">
          {isLoading ? "Loading variables" : "Select an option"}
        </SelectTrigger>
        {!isLoading && !isError && (
          <SelectContent>
            {data &&
              data.length &&
              data.map((value: Variable) => (
                <SelectItem key={value.id} value={value.name}>
                  {value.name}
                </SelectItem>
              ))}
          </SelectContent>
        )}
      </Select>
    </div>
  );
}
