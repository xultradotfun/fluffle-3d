import { TimelineEvent as TimelineEventType } from "./types";

type TimelineEventProps = {
  event: TimelineEventType;
  isCurrentPhase: boolean;
};

export const TimelineEvent = ({
  event,
  isCurrentPhase,
}: TimelineEventProps) => (
  <div className="mb-6 last:mb-0 group relative hover:bg-blue-500/[0.02] rounded-lg transition-colors duration-200 -ml-6 pl-6 py-2">
    <div className="absolute left-0 top-3 -translate-x-[7px] w-[14px] h-[14px] rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 border border-blue-500/30 dark:border-blue-500/40 group-hover:border-blue-500/50 transition-colors duration-200">
      <div className="absolute inset-[2.5px] rounded-full bg-blue-500 group-hover:animate-pulse" />
    </div>
    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2">
      {event.date}
      {isCurrentPhase && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium ring-1 ring-emerald-500/20">
          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          Current
        </span>
      )}
    </div>
    <div className="font-semibold text-foreground mb-1 text-base">
      {event.title}
    </div>
    <div className="text-sm text-muted-foreground">{event.description}</div>
  </div>
);
