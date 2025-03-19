export function NetworkInfo() {
  return (
    <div className="p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Network Information
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Chain ID
          </h3>
          <div className="font-mono text-sm text-gray-900 dark:text-white">
            1337
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Currency Symbol
          </h3>
          <div className="font-mono text-sm text-gray-900 dark:text-white">
            MEGA
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            RPC URL
          </h3>
          <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
            https://rpc.megaeth.org
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Block Explorer
          </h3>
          <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
            https://megaexplorer.xyz
          </div>
        </div>
      </div>
    </div>
  );
}
