export const NETWORK_INFO = {
  name: "MegaETH Testnet",
  chainId: "6342",
  rpcUrl: "https://carrot.megaeth.com/rpc",
  wsUrl: "wss://carrot.megaeth.com/ws",
  explorers: {
    performance: "https://uptime.megaeth.com/",
    community: "https://megaexplorer.xyz/",
  },
};

export const TIMELINE_EVENTS = [
  {
    date: "March 6th",
    title: "Testnet Deployment",
    description: "Initial deployment of the MegaETH public testnet",
    startDate: new Date("2025-03-05T00:00:00Z"),
    endDate: new Date("2025-03-05T23:59:59Z"),
  },
  {
    date: "March 6th",
    title: "Builder Onboarding",
    description: "Dedicated onboarding period for apps and infrastructure",
    startDate: new Date("2025-03-06T00:00:00Z"),
    endDate: new Date("2025-03-23T23:59:59Z"),
  },
  {
    date: "March 24th",
    title: "User Onboarding",
    description: "Public testnet access opens to all users",
    startDate: new Date("2025-03-24T00:00:00Z"),
    endDate: new Date("2025-03-30T23:59:59Z"),
  },
];
