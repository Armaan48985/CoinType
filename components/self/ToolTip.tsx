import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipDemoProps {
  hoverText?: React.ReactNode;
  tooltipText?: React.ReactNode; // Accepts string, icon, or any JSX element
  hoverClass?: string;
  tooltipClass?: string;
}

export function TooltipDemo({
  hoverText = "Hover me",
  tooltipText = "Tooltip content",
  hoverClass = "",
  tooltipClass = "",
}: TooltipDemoProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={2}>
        <TooltipTrigger asChild>
          <Button variant="default" className={hoverClass}>{hoverText}</Button>
        </TooltipTrigger>
        <TooltipContent className={tooltipClass}>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
