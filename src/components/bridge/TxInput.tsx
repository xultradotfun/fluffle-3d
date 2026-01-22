"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface TxInputProps {
  onSubmit: (txHash: string) => void;
  disabled?: boolean;
  initialValue?: string;
}

export function TxInput({ onSubmit, disabled, initialValue = "" }: TxInputProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          clipPath:
            "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
        }}
      >
        <div style={{ backgroundColor: "#f380cd", padding: "2px" }}>
          <div
            className="p-4"
            style={{
              backgroundColor: "#fff",
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
            }}
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 flex-shrink-0" style={{ color: "#19191a" }} strokeWidth={3} />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter Arbitrum transaction hash..."
                disabled={disabled}
                className="flex-1 bg-transparent text-base font-bold outline-none"
                style={{ color: "#19191a" }}
              />
              <button
                type="submit"
                disabled={disabled || !value.trim()}
                className="px-4 py-2 font-black uppercase text-sm transition-opacity disabled:opacity-40"
                style={{
                  backgroundColor: "#f380cd",
                  color: "#19191a",
                  clipPath:
                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                }}
              >
                Track
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
