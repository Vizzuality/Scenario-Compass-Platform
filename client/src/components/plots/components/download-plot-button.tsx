import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  onClick?: (selectedTypes: DOWNLOAD_TYPE[]) => void;
}

export type DOWNLOAD_TYPE = "png" | "csv";

export default function DownloadPlotButton({ onClick }: Props) {
  const [selectedTypes, setSelectedTypes] = useState<DOWNLOAD_TYPE[]>([]);
  const [open, setOpen] = useState(false);

  const handleTypeToggle = (type: DOWNLOAD_TYPE) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleDownload = () => {
    if (selectedTypes.length > 0 && onClick) {
      onClick(selectedTypes);
    }
    setSelectedTypes([]);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                aria-label="Download this data"
                aria-expanded={open}
                aria-haspopup="dialog"
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download this data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        className="w-46"
        role="dialog"
        aria-labelledby="download-title"
        aria-describedby="download-description"
        onKeyDown={handleKeyDown}
      >
        <div className="space-y-3">
          <div className="sr-only" id="download-description">
            Select file formats to download the plot
          </div>

          <fieldset className="space-y-2">
            <legend className="sr-only">Select download formats</legend>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="png"
                checked={selectedTypes.includes("png")}
                onCheckedChange={() => handleTypeToggle("png")}
                aria-describedby="png-description"
              />
              <Label htmlFor="png" className="cursor-pointer text-sm">
                .png (image)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="csv"
                checked={selectedTypes.includes("csv")}
                onCheckedChange={() => handleTypeToggle("csv")}
                aria-describedby="csv-description"
              />
              <Label htmlFor="csv" className="cursor-pointer text-sm">
                .csv (data)
              </Label>
            </div>
          </fieldset>

          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={selectedTypes.length === 0}
            className="mt-2 w-full text-sm"
            aria-label={
              selectedTypes.length === 0
                ? "Select at least one format to download"
                : `Download ${selectedTypes.length} file${selectedTypes.length > 1 ? "s" : ""}: ${selectedTypes.join(", ")}`
            }
          >
            Download
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
