"use client";

import { Check, Loader2, Zap } from "lucide-react";
import { colors } from "@/lib/colors";

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "DETECTED",
    description: "Found on Arbitrum",
  },
  {
    id: 2,
    title: "IN QUEUE",
    description: "Processing",
  },
  {
    id: 3,
    title: "COMPLETE",
    description: "Funds received",
  },
];

// Map the old 4-step system to new 3-step
function mapStep(oldStep: number): number {
  if (oldStep <= 1) return 1;
  if (oldStep <= 3) return 2;
  return 3;
}

interface StatusStepperProps {
  currentStep: 1 | 2 | 3 | 4;
  status: string;
  queuePosition?: number;
}

export function StatusStepper({ currentStep, status, queuePosition }: StatusStepperProps) {
  const isOrphaned = status === "ORPHANED";
  const isFailed = status === "FAILED";
  const mappedStep = mapStep(currentStep);

  return (
    <div className="w-full py-4">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted =
            step.id < mappedStep || (step.id === 3 && currentStep === 4);
          const isCurrent = step.id === mappedStep && currentStep !== 4;
          const isError = isCurrent && (isOrphaned || isFailed);

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  style={{
                    backgroundColor: isError
                      ? "colors.error"
                      : isCompleted
                      ? "colors.pink"
                      : isCurrent
                      ? "colors.pink"
                      : "colors.foreground",
                    color: isCompleted || isCurrent || isError ? "colors.foreground" : "colors.background",
                    border: "3px solid colors.foreground",
                    width: "48px",
                    height: "48px",
                    clipPath:
                      "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                  className="flex items-center justify-center transition-all duration-500 font-black"
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" strokeWidth={3} />
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 animate-spin" strokeWidth={3} />
                  ) : (
                    <Zap className="w-5 h-5" strokeWidth={3} />
                  )}
                </div>

                {/* Labels */}
                <div className="mt-3 text-center">
                  <p
                    className="text-sm font-black uppercase tracking-wider"
                    style={{
                      color: isCompleted || isCurrent ? "colors.pink" : "colors.background",
                    }}
                  >
                    {step.title}
                  </p>
                  <p
                    className="text-xs font-bold uppercase mt-1 max-w-[80px]"
                    style={{ color: "colors.background" }}
                  >
                    {step.description}
                  </p>
                  {step.id === 2 && isCurrent && queuePosition !== undefined && (
                    <p
                      className="text-[10px] font-black uppercase mt-1"
                      style={{ color: "colors.pink" }}
                    >
                      #{queuePosition} in queue
                    </p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 relative h-1 self-start mt-6">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: "colors.foreground",
                      height: "4px",
                    }}
                  />

                  {isCompleted && (
                    <div
                      className="absolute inset-y-0 left-0 right-0"
                      style={{
                        backgroundColor: "colors.pink",
                        height: "4px",
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
