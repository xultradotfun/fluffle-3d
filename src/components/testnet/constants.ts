export const NETWORK_INFO = {
  name: "MegaETH Testnet",
  chainId: "6342",
  rpcUrl: "https://rpc.testnet.megaeth.com",
  wsUrl: "wss://ws.testnet.megaeth.com",
  explorers: {
    performance: "https://performance.testnet.megaeth.com",
    community: "https://explorer.testnet.megaeth.com",
  },
};

export const TIMELINE_EVENTS = [
  {
    date: "March 6th",
    title: "Testnet Launch",
    description: "MegaETH testnet goes live with initial infrastructure setup",
    startDate: new Date("2024-03-06T00:00:00Z"),
    endDate: new Date("2024-03-09T23:59:59Z"),
  },
  {
    date: "March 10th",
    title: "Distribution Phase",
    description: "Testnet ETH distribution begins for registered wallets",
    startDate: new Date("2024-03-10T00:00:00Z"),
    endDate: new Date("2024-03-13T23:59:59Z"),
  },
  {
    date: "March 14th",
    title: "Builder Phase",
    description: "Early access for builders to deploy and test applications",
    startDate: new Date("2024-03-14T00:00:00Z"),
    endDate: new Date("2024-03-20T23:59:59Z"),
  },
  {
    date: "March 21st",
    title: "Public Testing",
    description: "Open testing phase for all users and applications",
    startDate: new Date("2024-03-21T00:00:00Z"),
    endDate: new Date("2024-04-21T23:59:59Z"),
  },
];
