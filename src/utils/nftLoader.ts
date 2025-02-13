export interface NFTTrait {
  tribe: number;
  skin: number;
  hair: number;
  eyeball: number;
  eyeliner: number;
  eyebrow: number;
  head: number;
  ear: number;
  face: number;
  tribe_display_name: string;
  skin_display_name: string;
  hair_display_name: string;
  eyeball_display_name: string;
  eyeliner_display_name: string;
  eyebrow_display_name: string | number;
  head_display_name: string;
  ear_display_name: string | number;
  face_display_name: string | number;
}

interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

interface NFTMetadata {
  name: string;
  image: string;
  attributes: NFTAttribute[];
  type: string;
  format: string;
  model_url: string;
}

interface NFTLoadResult {
  urls: string[];
  traits: NFTTrait;
}

const TRAIT_URLS = {
  base: "https://hologramxyz.s3.amazonaws.com/partnerships/MEGAETH/3d/",
  ear: "https://hologramxyz.s3.amazonaws.com/partnerships/MEGAETH/3d/ear/",
  face: "https://hologramxyz.s3.amazonaws.com/partnerships/MEGAETH/3d/face/",
  head: "https://hologramxyz.s3.amazonaws.com/partnerships/MEGAETH/3d/head/",
  tribe:
    "https://hologramxyz.s3.amazonaws.com/partnerships/MEGAETH/3d/tribe_clothes/",
};

const TRAITS_METADATA_URL =
  "https://gist.githubusercontent.com/0x-ultra/73ecc2e5e0f553ea3deb6be6aae46a33/raw/megaeth-metadata.json";

// Cache the traits data to avoid fetching it multiple times
let cachedTraitData: Record<string, NFTTrait> | undefined;

async function fetchTraitData(): Promise<Record<string, NFTTrait>> {
  if (cachedTraitData) {
    return cachedTraitData;
  }

  const response = await fetch(TRAITS_METADATA_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch trait data");
  }

  const data: Record<string, NFTTrait> = await response.json();
  cachedTraitData = data;
  return data;
}

export async function loadNFTModels(nftId: string): Promise<NFTLoadResult> {
  try {
    // 1. Fetch the NFT metadata
    const metadataUrl = `https://hologramxyz.s3.amazonaws.com/partnerships/MEGAETH/metadata/${nftId}`;
    const metadataResponse = await fetch(metadataUrl);
    if (!metadataResponse.ok) {
      throw new Error(`Failed to fetch metadata for NFT #${nftId}`);
    }
    const metadata: NFTMetadata = await metadataResponse.json();

    // 2. Extract the internal ID and filename from the model URL
    const idMatch = metadata.model_url.match(/ID(\d+)/);
    if (!idMatch) {
      throw new Error("Could not extract ID from model URL");
    }
    const internalId = idMatch[1];

    // Get the base filename from the model_url
    const baseFilename = metadata.model_url.split("/").pop();
    if (!baseFilename) {
      throw new Error("Could not extract filename from model URL");
    }

    // 3. Fetch the trait data from GitHub Gist
    const traitData = await fetchTraitData();
    const traits = traitData[internalId];

    if (!traits) {
      throw new Error(`No trait data found for ID ${internalId}`);
    }

    // 4. Generate all required model URLs
    const modelUrls = [
      // Base model
      `${TRAIT_URLS.base}${baseFilename}`,
    ];

    // Add additional trait models if they exist (not -1)
    if (traits.head !== -1) {
      modelUrls.push(`${TRAIT_URLS.head}${traits.head}.vrm`);
    }
    if (traits.ear !== -1) {
      modelUrls.push(`${TRAIT_URLS.ear}${traits.ear}.vrm`);
    }
    if (traits.face !== -1) {
      modelUrls.push(`${TRAIT_URLS.face}${traits.face}.vrm`);
    }
    if (traits.tribe !== -1) {
      modelUrls.push(`${TRAIT_URLS.tribe}${traits.tribe}.vrm`);
    }

    return { urls: modelUrls, traits };
  } catch (error) {
    console.error("Error loading NFT models:", error);
    throw error;
  }
}
