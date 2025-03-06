import { TIMELINE_EVENTS } from "./constants";
import { TimelineEvent } from "./TimelineEvent";

type TimelineSectionProps = {
  currentPhase: number;
};

export const TimelineSection = ({ currentPhase }: TimelineSectionProps) => (
  <div>
    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
      <svg
        className="w-5 h-5 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Launch Timeline
    </h2>
    <div className="p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <div className="relative pl-6 border-l-2 border-blue-500/20 dark:border-blue-500/30">
        {TIMELINE_EVENTS.map((event, index) => (
          <TimelineEvent
            key={event.date}
            event={event}
            isCurrentPhase={currentPhase === index}
          />
        ))}
      </div>
    </div>
  </div>
);
