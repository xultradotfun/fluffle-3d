import { useState } from "react";
import { colors } from "@/lib/colors";
import { BorderedBox } from "@/components/ui/BorderedBox";
import { Code, ChevronDown, ChevronUp } from "lucide-react";

export function ApiDocumentation() {
  const [showApiDocs, setShowApiDocs] = useState(false);

  return (
    <BorderedBox cornerSize="lg" borderColor="dark" bgColor="light">
          <button
            onClick={() => setShowApiDocs(!showApiDocs)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Code
                className="w-4 h-4"
                style={{ color: colors.foreground }}
                strokeWidth={3}
              />
              <span
                className="text-sm font-black uppercase"
                style={{ color: colors.foreground }}
              >
                API Documentation
              </span>
            </div>
            {showApiDocs ? (
              <ChevronUp
                className="w-4 h-4"
                style={{ color: colors.foreground }}
                strokeWidth={3}
              />
            ) : (
              <ChevronDown
                className="w-4 h-4"
                style={{ color: colors.foreground }}
                strokeWidth={3}
              />
            )}
          </button>

          {showApiDocs && (
            <div
              className="px-4 pb-4 space-y-3 border-t-2"
              style={{ borderColor: colors.foreground }}
            >
              <div className="pt-3">
                <p
                  className="text-xs font-bold mb-2"
                  style={{ color: colors.foreground }}
                >
                  ENDPOINT
                </p>
                <code
                  className="block px-3 py-2 text-xs font-mono rounded border-2"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.foreground,
                    borderColor: colors.foreground,
                  }}
                >
                  POST https://megasale-check.xultra.fun/api/allocations/check
                </code>
              </div>

              <div>
                <p
                  className="text-xs font-bold mb-2"
                  style={{ color: colors.foreground }}
                >
                  REQUEST BODY
                </p>
                <pre
                  className="px-3 py-2 text-xs font-mono rounded border-2 overflow-x-auto"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.foreground,
                    borderColor: colors.foreground,
                  }}
                >
                  {`{
  "wallets": [
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
  ]
}`}
                </pre>
              </div>

              <div>
                <p
                  className="text-xs font-bold mb-2"
                  style={{ color: colors.foreground }}
                >
                  RESPONSE
                </p>
                <pre
                  className="px-3 py-2 text-xs font-mono rounded border-2 overflow-x-auto"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.foreground,
                    borderColor: colors.foreground,
                  }}
                >
                  {`{
  "success": true,
  "count": 2,
  "data": [
    {
      "walletAddress": "0x1234567890123456789012345678901234567890",
      "usdAmount": 5000.00,
      "megaAmount": 50050.05,
      "hasAllocation": true,
      "status": "ACTIVE",
      "bidAmount": 186282,
      "locked": false,
      "rank": {
        "overall": 123,
        "category": 45,
        "categoryType": "unlocked"
      }
    },
    {
      "walletAddress": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      "usdAmount": 10000.00,
      "megaAmount": 100100.10,
      "hasAllocation": true,
      "status": "ACTIVE",
      "bidAmount": 186282,
      "locked": true,
      "rank": {
        "overall": 67,
        "category": 12,
        "categoryType": "locked"
      }
    }
  ]
}`}
                </pre>
              </div>

              <div>
                <p
                  className="text-xs font-bold mb-2"
                  style={{ color: colors.foreground }}
                >
                  EXAMPLE (JAVASCRIPT)
                </p>
                <pre
                  className="px-3 py-2 text-xs font-mono rounded border-2 overflow-x-auto"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.foreground,
                    borderColor: colors.foreground,
                  }}
                >
                  {`const response = await fetch(
  'https://megasale-check.xultra.fun/api/allocations/check',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallets: ['0x1234567890123456789012345678901234567890']
    })
  }
);
const data = await response.json();`}
                </pre>
              </div>
            </div>
          )}
    </BorderedBox>
  );
}
