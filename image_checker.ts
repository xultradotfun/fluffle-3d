import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

const ENDPOINTS = {
  ear: "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/ear/",
  face: "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/face/",
  head: "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/head/",
  clothes:
    "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/clothes/",
};

const DOWNLOAD_DIR = "downloaded_images";

function createProgressBar(current: number, total: number, width = 30): string {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((width * current) / total);
  const empty = width - filled;
  const filledBar = "█".repeat(filled);
  const emptyBar = "░".repeat(empty);
  return `[${filledBar}${emptyBar}] ${percentage}% (${current}/${total})`;
}

async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function checkAndDownloadImage(
  url: string,
  category: string,
  number: number
): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;

    const categoryDir = path.join(DOWNLOAD_DIR, category);
    await ensureDirectoryExists(categoryDir);

    const buffer = await response.arrayBuffer();
    const filepath = path.join(categoryDir, `${number}.png`);
    await fs.writeFile(filepath, Buffer.from(buffer));

    return true;
  } catch (error) {
    console.error(`Failed to process ${url}:`, error);
    return false;
  }
}

async function findExistingImages() {
  const results: Record<string, number[]> = {};
  const MAX_NUMBER = 100;

  // Create base download directory
  await ensureDirectoryExists(DOWNLOAD_DIR);

  for (const [category, baseUrl] of Object.entries(ENDPOINTS)) {
    console.log(`\n\nProcessing ${category.toUpperCase()}...`);
    results[category] = [];

    for (let i = 0; i <= MAX_NUMBER; i++) {
      // Update progress bar
      process.stdout.write(`\r${createProgressBar(i, MAX_NUMBER)} `);

      const url = `${baseUrl}${i}.png`;
      const exists = await checkAndDownloadImage(url, category, i);

      if (exists) {
        results[category].push(i);
        process.stdout.write(`✓`); // Show success indicator
      }
    }

    // Final status for this category
    const count = results[category].length;
    console.log(`\n✅ Found ${count} images for ${category}`);
    if (count > 0) {
      console.log(`📁 Saved to: ${path.join(DOWNLOAD_DIR, category)}`);
      console.log(`🔢 Valid numbers: ${results[category].join(", ")}`);
    }
  }

  return results;
}

// Run the check
console.log("🔍 Starting image check and download...");
console.log(`📂 Download directory: ${path.resolve(DOWNLOAD_DIR)}\n`);

findExistingImages().then((results) => {
  console.log("\n📊 Summary:");
  for (const [category, images] of Object.entries(results)) {
    console.log(`\n${category.toUpperCase()}:`);
    console.log(`Total images: ${images.length}`);
    if (images.length > 0) {
      console.log(`Numbers: ${images.join(", ")}`);
    }
  }
});
