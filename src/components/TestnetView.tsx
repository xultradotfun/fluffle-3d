import { FlaskConical } from "lucide-react";

export function TestnetView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="flex items-center gap-3 text-violet-600 dark:text-violet-400 mb-3">
        <FlaskConical className="w-8 h-8" />
        <h1 className="text-2xl font-semibold">MegaETH Testnet</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
        The MegaETH Testnet is coming very soon! This page will be updated with
        more information and guides as we get closer to launch.
      </p>
    </div>
  );
}
