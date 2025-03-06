import { NetworkInfo, TimelineEvent } from "../types";

export const NETWORK_INFO: NetworkInfo = {
  name: "MegaETH Testnet",
  chainId: "6342",
  rpcUrl: "https://carrot.megaeth.com/rpc",
  wsUrl: "wss://carrot.megaeth.com/ws",
  explorers: {
    performance: "https://uptime.megaeth.com",
    community: "https://megaexplorer.xyz",
  },
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: "March 6th",
    title: "Testnet Deployment",
    description: "Initial deployment of the MegaETH public testnet",
    startDate: new Date("2024-03-06"),
    endDate: new Date("2024-03-06"),
  },
  {
    date: "March 6-10th",
    title: "Builder Onboarding",
    description: "Dedicated onboarding period for apps and infrastructure",
    startDate: new Date("2024-03-06"),
    endDate: new Date("2024-03-10"),
  },
  {
    date: "March 10th",
    title: "User Onboarding",
    description: "Public testnet access opens to all users",
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-12-31"),
  },
];
