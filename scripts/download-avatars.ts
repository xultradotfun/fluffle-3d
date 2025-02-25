import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import { fileURLToPath } from "url";
import type { IncomingMessage } from "http";

interface Project {
  twitter: string;
  [key: string]: any; // Allow other properties
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");

const AVATARS_DIR = path.join(PROJECT_ROOT, "public/avatars");

// Read ecosystem.json file
const ecosystemData = JSON.parse(
  fs.readFileSync(path.join(PROJECT_ROOT, "src/data/ecosystem.json"), "utf-8")
) as { projects: Project[] };

// Create avatars directory if it doesn't exist
if (!fs.existsSync(AVATARS_DIR)) {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

function makeRequest(
  url: string,
  options: https.RequestOptions
): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    https.get(url, options, resolve).on("error", reject);
  });
}

async function downloadImage(twitter: string): Promise<void> {
  const filename = path.join(AVATARS_DIR, `${twitter}.jpg`);

  // Skip if file already exists
  if (fs.existsSync(filename)) {
    console.log(`Skipping ${twitter} - already exists`);
    return;
  }

  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
    timeout: 10000,
  };

  try {
    const url = `https://unavatar.io/twitter/${twitter}`;
    const response = await makeRequest(url, options);

    if (response.statusCode === 301 || response.statusCode === 302) {
      const redirectUrl = response.headers.location;
      if (!redirectUrl) {
        throw new Error("No redirect URL");
      }

      // Make sure we have a full URL
      const fullRedirectUrl = redirectUrl.startsWith("http")
        ? redirectUrl
        : `https://unavatar.io${redirectUrl}`;
      const redirectResponse = await makeRequest(fullRedirectUrl, options);

      if (redirectResponse.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        redirectResponse.pipe(fileStream);
        await new Promise<void>((resolve) => {
          fileStream.on("finish", () => {
            fileStream.close();
            resolve();
          });
        });
        console.log(`Downloaded ${twitter}`);
      } else {
        throw new Error(
          `Failed to download image after redirect: ${redirectResponse.statusCode}`
        );
      }
    } else if (response.statusCode === 200) {
      const fileStream = fs.createWriteStream(filename);
      response.pipe(fileStream);
      await new Promise<void>((resolve) => {
        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });
      });
      console.log(`Downloaded ${twitter}`);
    } else {
      throw new Error(`Failed to download image: ${response.statusCode}`);
    }
  } catch (error) {
    console.error(`Error downloading ${twitter}:`, error);
    // Create fallback using initials
    const fallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${twitter}`;
    try {
      const fallbackResponse = await makeRequest(fallbackUrl, options);
      const fileStream = fs.createWriteStream(filename);
      fallbackResponse.pipe(fileStream);
      await new Promise<void>((resolve) => {
        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });
      });
      console.log(`Created fallback for ${twitter}`);
    } catch (fallbackError) {
      console.error(`Failed to create fallback for ${twitter}:`, fallbackError);
    }
  }
}

async function main() {
  const projects = ecosystemData.projects;

  // Filter projects that don't have images yet
  const projectsNeedingImages = projects.filter((project) => {
    const imagePath = path.join(AVATARS_DIR, `${project.twitter}.jpg`);
    const exists = fs.existsSync(imagePath);
    if (exists) {
      console.log(`Image for ${project.twitter} already exists, skipping`);
    }
    return !exists;
  });

  if (projectsNeedingImages.length === 0) {
    console.log("All project images are up to date!");
    return;
  }

  console.log(
    `Downloading images for ${projectsNeedingImages.length} projects...`
  );

  // Download images sequentially to avoid rate limiting
  for (const project of projectsNeedingImages) {
    try {
      await downloadImage(project.twitter);
      // Add a small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to process ${project.twitter}:`, error);
    }
  }

  console.log("Finished downloading new images!");
}

main().catch(console.error);
