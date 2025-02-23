# Fluffle Tools

<div align="center">
  <img src="/public/socialpreview.jpg" alt="Fluffle Tools Preview" width="600" />
  <p>A comprehensive web application providing utilities for MegaETH Fluffle NFT holders.</p>
</div>

<div align="center">
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-13-black" alt="Next.js" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind-3-38bdf8" alt="Tailwind CSS" />
  </a>
  <a href="https://threejs.org">
    <img src="https://img.shields.io/badge/Three.js-Latest-black" alt="Three.js" />
  </a>
  <img src="https://img.shields.io/badge/License-Custom-red" alt="License" />
</div>

## ✨ Features

- **3D Model Viewer**: View your Fluffle in 3D with VRM support
- **Rarity Analytics**: Comprehensive dashboard for trait rarity analysis
- **PFP Generator**: Create custom profile pictures with background options
- **Modern UI/UX**: Clean, responsive interface with dark mode support
- **Full Collection Support**: Compatible with all 5,000 Fluffle NFTs
- **Performance Optimized**: Fast loading and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fluffle-3d.git
cd fluffle-3d
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Adding Projects to the Ecosystem

Projects in the MegaETH ecosystem can be added to the platform by modifying `src/data/ecosystem.json`. Each project should follow this format:

```json
{
  "name": "Project Name",
  "twitter": "twitter_handle", // without @
  "website": "https://project-website.com", // optional
  "discord": "https://discord.gg/invite-code", // optional
  "telegram": "https://t.me/group-name", // optional
  "description": "A brief description of the project",
  "category": "Category",
  "megaMafia": false // true if it's a MegaMafia project
}
```

### Categories

Available categories:

- `NFT`: NFT collections and marketplaces
- `DeFi`: Decentralized finance projects
- `Infrastructure`: Core blockchain infrastructure
- `Community`: Community tools and platforms
- `Gaming`: Gaming and metaverse projects

### Example

```json
{
  "name": "MegaDex Labs",
  "twitter": "megadex_labs",
  "website": "https://megadex.app",
  "discord": "https://discord.gg/megadex",
  "description": "V3 concentrated liquidity and an AMM protocol ecosystem that hits different",
  "category": "DeFi",
  "megaMafia": false
}
```

### Guidelines

1. **Project Name**:

   - Use the official project name
   - Maintain consistent capitalization

2. **Social Links**:

   - Twitter handle without the @ symbol
   - Full URLs for website, Discord, and Telegram
   - Only include active social channels

3. **Description**:

   - Keep it concise (1-2 sentences)
   - Focus on the main value proposition
   - Avoid excessive technical jargon

4. **Category**:

   - Choose the most relevant category
   - Use existing categories when possible
   - Contact maintainers if a new category is needed

5. **MegaMafia Status**:
   - Set `megaMafia` to `true` only for official MegaMafia projects
   - When in doubt, set to `false`

### Adding Your Project

1. Fork the repository
2. Add your project to `src/data/ecosystem.json`
3. Maintain alphabetical order within the projects array
4. Create a pull request with your changes
5. Include any relevant social proof or verification

## 🛠 Technology Stack

- **Framework**: [Next.js 13](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Graphics**:
  - [Three.js](https://threejs.org/)
  - [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)
- **State Management**: React Hooks
- **Deployment**: [Vercel](https://vercel.com)

## 📦 Project Structure

```
fluffle-3d/
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── analytics/   # Analytics components
│   │   ├── metaverse/   # 3D viewer components
│   │   ├── pfp/         # PFP generator components
│   │   └── ui/          # Shared UI components
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## 🚢 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository
2. Import your repository on [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and deploy

## 🤝 Contributing

Contributions are welcome! Please check our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is protected under a custom license that allows viewing, using, and contributing to the original repository while restricting redistribution and commercial use. See the [LICENSE](LICENSE) file for details.

Key points:

- ✅ You can contribute to the project
- ✅ You can use it for private, non-distributed purposes
- ❌ You cannot redistribute it as a standalone application
- ❌ You cannot create public derivative works
- ❌ You cannot use it for commercial purposes without permission

## 🔗 Links

- [Website](https://fluffletools.com)
- [OpenSea Collection](https://opensea.io/collection/megaeth-nft-1)
- [Twitter](https://twitter.com/0x_ultra)
