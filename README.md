# Fluffle Tools

<div align="center">
  <img src="/public/socialpreview.jpg" alt="Fluffle Tools Preview" width="600" />
  <p>Utilities for MegaETH explorers and Fluffle holders</p>
</div>

<div align="center">
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js" />
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
- **NFT Analytics**: Comprehensive dashboard for NFT trait analysis and rarity tracking
- **PFP Generator**: Create custom profile pictures with background options
- **Ecosystem Directory**: Curated list of MegaETH ecosystem projects
- **Builder Tools**: Custom tools for NFT and metaverse development
- **Testnet Integration**: Access and interact with MegaETH testnet
- **Modern UI/UX**: Clean, responsive interface with dark mode support
- **Discord Integration**: Secure authentication and role-based access
- **Responsive Design**: Optimized for both desktop and mobile experiences

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git
- Discord application credentials (for auth features)

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

3. Set up environment variables:

Create a `.env` file with the following:

```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DATABASE_URL=your_database_url
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Ecosystem Directory

The project includes a comprehensive directory of MegaETH ecosystem projects in `src/data/ecosystem.json`. Each project entry follows this structure:

```json
{
  "name": "Project Name",
  "twitter": "twitter_handle", // without @
  "website": "https://project-website.com", // optional
  "discord": "https://discord.gg/invite-code", // optional
  "telegram": "https://t.me/group-name", // optional
  "description": "A brief description of the project",
  "category": "Category",
  "megaMafia": false, // true if it's a MegaMafia project
  "native": true, // true if it's native to MegaETH ecosystem
  "testnet": false // true if the project is on testnet
}
```

### Project Categories

- `NFT`: NFT collections and marketplaces
- `DeFi`: Decentralized finance projects
- `Infrastructure`: Core blockchain infrastructure
- `Community`: Community tools and platforms
- `Gaming`: Gaming and metaverse projects
- `AI`: Artificial Intelligence and agent projects
- `Meme`: Meme coins and related projects

### Project Status Fields

- `megaMafia`: Set to `true` for official MegaMafia projects
- `native`: Set to `true` for projects built specifically for MegaETH
- `testnet`: Set to `true` for projects currently on testnet

### Adding Projects

1. Fork the repository
2. Add your project to `src/data/ecosystem.json`
3. Add your project logo to `/public/avatars/[twitter_handle].jpg`
4. Maintain alphabetical order within the projects array
5. Create a pull request with your changes

## 📦 Project Structure

```
fluffle-3d/
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── api/         # API routes including Discord auth
│   │   ├── tools/       # Main application tools
│   │   └── ecosystem/   # Ecosystem directory pages
│   ├── components/      # React components
│   │   ├── analytics/   # Analytics components
│   │   ├── builder/     # Builder tool components
│   │   ├── ecosystem/   # Ecosystem directory components
│   │   ├── metaverse/   # 3D viewer components
│   │   ├── nft/         # NFT-related components
│   │   ├── pfp/         # PFP generator components
│   │   ├── testnet/     # Testnet integration components
│   │   └── ui/          # Shared UI components
│   ├── data/           # Static data and configurations
│   ├── lib/            # Shared libraries and utilities
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript type definitions
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## 🛠 Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Graphics**:
  - [Three.js](https://threejs.org/)
  - [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)
- **Authentication**: Discord OAuth2
- **Database**: Prisma with PostgreSQL
- **State Management**: React Hooks
- **Deployment**: [Vercel](https://vercel.com)

## 🚢 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository
2. Import your repository on [Vercel](https://vercel.com/new)
3. Set up the required environment variables:
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `DATABASE_URL`
4. Vercel will automatically detect Next.js and deploy

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

- [Website](https://fluffle.tools)
- [Twitter](https://x.com/0x_ultra)
