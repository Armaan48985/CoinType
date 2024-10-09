import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipDemo({hoverText, tooltipText, hoverClass, tooltipClass}:any) {
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
