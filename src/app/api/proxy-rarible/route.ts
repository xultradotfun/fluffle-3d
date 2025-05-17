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
  minted_supply?: number;
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
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      cache: "no-store",
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
    const formattedMints: FormattedMint[] = await Promise.all(
      drops.map(async (drop) => {
        // Convert ISO date string to timestamp in milliseconds
        const startTimestamp = new Date(drop.startDate).getTime();
        const endTimestamp = drop.endDate
          ? new Date(drop.endDate).getTime()
          : undefined;

        // Extract contract address from drop.id
        console.log(`[Rarible Proxy] ${drop.title} - Raw drop.id:`, drop.id);
        console.log(
          `[Rarible Proxy] ${drop.title} - Drop data:`,
          JSON.stringify(drop, null, 2)
        );
        const contractAddress = drop.id.split(":")[1];

        // Fetch minted supply for this drop
        let mintedSupply: number | undefined;
        try {
          const supplyResponse = await fetch(
            `https://testnet-bff.rarible.fun/api/drops/MEGAETHTESTNET:${contractAddress}/minted`,
            {
              method: "POST",
              headers: {
                accept: "*/*",
                "content-type": "application/json",
                origin: "https://testnet.rarible.fun",
                referer: "https://testnet.rarible.fun/",
                "sec-fetch-site": "same-site",
                "sec-fetch-mode": "cors",
                "sec-fetch-dest": "empty",
                "user-agent":
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
                "x-api-key": apiKey,
              },
              body: JSON.stringify({
                id: `MEGAETHTESTNET:${contractAddress}`,
              }),
            }
          );

          if (supplyResponse.ok) {
            const supplyData = await supplyResponse.json();
            mintedSupply = parseInt(supplyData.minted);
          } else {
            console.error(
              `[Rarible Proxy] Failed to fetch minted supply for ${drop.title}:`,
              `\n- Contract: ${contractAddress}`,
              `\n- Status: ${supplyResponse.status}`,
              `\n- Status Text: ${supplyResponse.statusText}`,
              `\n- Error Body: ${await supplyResponse.text()}`
            );
          }
        } catch (error) {
          console.error(
            `[Rarible Proxy] Error fetching minted supply for ${drop.title}:`,
            `\n- Contract: ${contractAddress}`,
            `\n- Error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }

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

        const formattedMint = {
          collection_name: drop.title,
          description: drop.description,
          profile_image: `https://testnet.rarible.fun${drop.media.url}`,
          header_image: `https://testnet.rarible.fun${drop.media.url}`,
          total_supply: drop.quantity || null,
          mint_live_timestamp: startTimestamp,
          mint_page_link: `https://testnet.rarible.fun/collections/megaethtestnet/${contractAddress}/drops`,
          chain: {
            chain_id: 6342,
            chain_name: "MegaETH Testnet",
            native_currency: drop.price.currency.abbreviation,
          },
          mint_group_data: [mintGroup],
          author: drop.author,
          minted_supply: mintedSupply,
        };

        // Debug log for supply check
        if (formattedMint.total_supply !== null) {
          console.log(
            `[Rarible Proxy] ${drop.title} - Supply Check:`,
            `\n- Total Supply: ${formattedMint.total_supply}`,
            `\n- Minted Supply: ${mintedSupply ?? "unknown"}`,
            `\n- Is Sold Out: ${
              mintedSupply !== undefined &&
              mintedSupply >= formattedMint.total_supply
            }`
          );
        }

        return formattedMint;
      })
    );

    // Add debug logging for collection categorization
    const categorizedCollections = {
      live: formattedMints.filter((mint) => {
        const now = Date.now();
        const startTime = mint.mint_live_timestamp;
        const endTime = mint.mint_group_data[0].endTime;
        const isSoldOut =
          mint.total_supply !== null &&
          mint.minted_supply !== undefined &&
          mint.minted_supply >= mint.total_supply;

        const isLive =
          now >= startTime && (!endTime || now <= endTime) && !isSoldOut;

        if (mint.collection_name === "G-420: FUN Simulation Cartridge") {
          console.log(
            `[Rarible Proxy] G-420 Status Check:`,
            `\n- Start Time Check: ${now >= startTime}`,
            `\n- End Time Check: ${!endTime || now <= endTime}`,
            `\n- Total Supply: ${mint.total_supply}`,
            `\n- Minted Supply: ${mint.minted_supply}`,
            `\n- Is Sold Out: ${isSoldOut}`,
            `\n- Final Live Status: ${isLive}`
          );
        }

        return isLive;
      }),
      upcoming: formattedMints.filter((mint) => {
        const now = Date.now();
        return now < mint.mint_live_timestamp;
      }),
      sold_out: formattedMints.filter((mint) => {
        const now = Date.now();
        const endTime = mint.mint_group_data[0].endTime;
        const isSoldOut =
          mint.total_supply !== null &&
          mint.minted_supply !== undefined &&
          mint.minted_supply >= mint.total_supply;

        return (endTime && now > endTime) || isSoldOut;
      }),
    };

    // Log final categorization counts
    console.log(
      `[Rarible Proxy] Final categorization:`,
      `\n- Live: ${categorizedCollections.live.length}`,
      `\n- Upcoming: ${categorizedCollections.upcoming.length}`,
      `\n- Sold Out: ${categorizedCollections.sold_out.length}`
    );

    return NextResponse.json({ partnerCollections: categorizedCollections });
  } catch (error) {
    console.error("[Rarible Proxy] Error fetching drops:", error);
    return NextResponse.json(
      { error: "Failed to fetch drops" },
      { status: 500 }
    );
  }
}
