import { NextResponse } from "next/server";

interface RaribleDrop {
  id: string;
  title: string;
  description: string;
  media: {
    type: string;
    url: string;
  };
  startDate: string;
  endDate?: string;
  price: {
    amount: string;
    currency: {
      abbreviation: string;
      usdExchangeRate: string;
    };
  };
  quantity?: number;
  blockchain: string;
  isVerified: boolean;
  maxMintPerWallet?: number;
  author: string;
  tokenStandard: string;
}

// Format to match Kingdomly API response format
interface FormattedMint {
  collection_name: string;
  description: string;
  profile_image: string;
  header_image: string;
  total_supply: number | null;
  mint_live_timestamp: number;
  mint_page_link: string;
  chain: {
    chain_id: number;
    chain_name: string;
    native_currency: string;
  };
  mint_group_data: Array<{
    id: number;
    name: string;
    price: number;
    allocation: number;
    max_mint_per_wallet?: number;
    startTime?: number;
    endTime?: number;
  }>;
  author: string;
}

export async function GET() {
  try {
    const apiUrl = "https://testnet-bff.rarible.fun/api/drops/search";
    const apiKey = "aaa88771-62ce-40d6-b588-e6d9600d60e9";

    console.log(`[Rarible Proxy] Fetching drops from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        Accept: "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.error(
        `[Rarible Proxy] API responded with status: ${response.status}`
      );
      return NextResponse.json(
        { error: `API responded with status: ${response.status}` },
        { status: response.status }
      );
    }

    const drops: RaribleDrop[] = await response.json();
    console.log(`[Rarible Proxy] Successfully retrieved ${drops.length} drops`);

    // Transform Rarible drops to match Kingdomly format
    const formattedMints: FormattedMint[] = drops.map((drop) => {
      // Convert ISO date string to timestamp in milliseconds
      const startTimestamp = new Date(drop.startDate).getTime();
      const endTimestamp = drop.endDate
        ? new Date(drop.endDate).getTime()
        : undefined;

      // Format mint group data
      const mintGroup = {
        id: 1,
        name: "Public",
        price: parseFloat(drop.price.amount),
        allocation: drop.quantity || 0,
        max_mint_per_wallet: drop.maxMintPerWallet,
        startTime: startTimestamp,
        endTime: endTimestamp,
      };

      // Extract contract address from drop.id
      const contractAddress = drop.id.split(":")[1];

      return {
        collection_name: drop.title,
        description: drop.description,
        profile_image: `https://testnet.rarible.fun${drop.media.url}`,
        header_image: `https://testnet.rarible.fun${drop.media.url}`,
        total_supply: drop.quantity || null,
        mint_live_timestamp: startTimestamp,
        mint_page_link: `https://testnet.rarible.fun/collections/megaethtestnet/${contractAddress}/drops`,
        chain: {
          chain_id: 6342, // MegaETH Testnet
          chain_name: "MegaETH Testnet",
          native_currency: drop.price.currency.abbreviation,
        },
        mint_group_data: [mintGroup],
        author: drop.author,
      };
    });

    // Return the formatted data
    return NextResponse.json({
      partnerCollections: {
        live: formattedMints.filter((mint) => {
          const now = Date.now();
          const startTime = mint.mint_live_timestamp;
          const endTime = mint.mint_group_data[0].endTime;
          return now >= startTime && (!endTime || now <= endTime);
        }),
        upcoming: formattedMints.filter((mint) => {
          const now = Date.now();
          return now < mint.mint_live_timestamp;
        }),
        sold_out: formattedMints.filter((mint) => {
          const now = Date.now();
          const endTime = mint.mint_group_data[0].endTime;
          return endTime && now > endTime;
        }),
      },
    });
  } catch (error) {
    console.error("[Rarible Proxy] Error fetching drops:", error);
    return NextResponse.json(
      { error: "Failed to fetch drops" },
      { status: 500 }
    );
  }
}
