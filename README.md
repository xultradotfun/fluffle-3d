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
  <img src="https://img.shields.io/badge/License-Custom-red" alt="License" />
</div>

## ✨ Features

- **MegaETH Ecosystem**: Discover and vote on projects building on MegaETH with community-driven rankings
- **MegaETH Moonmath**: Calculate potential returns for Echo, Fluffle & Sonar investment rounds
- **Fluffle Builder**: Create your perfect Fluffle NFT by mixing and matching traits
- **PFP Generator**: Generate custom profile pictures from your Fluffle NFTs
- **Testnet Bingo**: Track your progress completing MegaETH testnet tasks
- **Discord Integration**: Secure authentication with role-based voting power
- **Brutalist Design**: Bold, high-contrast UI inspired by MegaETH's aesthetic
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

## 📝 MegaETH Ecosystem

The ecosystem directory fetches projects from the Fluffle Tools API (`https://api.fluffle.tools/api/projects/full`). Each project includes:

- **Project Information**: Name, description, category, and social links
- **Voting System**: Community-driven rankings with role-based voting power
- **Status Indicators**: Live status, MegaMafia membership, and Omega designation
- **Custom Images**: Project logos and branding

### Voting System

- **Role-Based Power**: Different Discord roles have different voting weights
  - MiniETH: 1 vote
  - MegaETH: 5 votes
  - GigaETH: 10 votes
  - TeraETH: 50 votes
  - PetaETH: 100 votes
  - ExaETH: 500 votes
- **Vote Caching**: User votes are cached locally for instant feedback
- **Real-time Updates**: Vote counts update immediately after submission

### Project Categories

- `NFT`: NFT collections and marketplaces
- `DeFi`: Decentralized finance projects
- `Infrastructure`: Core blockchain infrastructure
- `Community`: Community tools and platforms
- `Gaming`: Gaming and metaverse projects
- `AI`: Artificial Intelligence and agent projects
- `Meme`: Meme coins and related projects

### Adding Projects

Projects are managed through the Fluffle Tools API. To add your project, please contact the team via Discord or Twitter.

## 📦 Project Structure

```
fluffle-3d/
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── api/         # API routes (Discord auth, math markets)
│   │   ├── bingo/       # Testnet Bingo page
│   │   ├── builder/     # Fluffle Builder page
│   │   ├── math/        # MegaETH Moonmath calculator
│   │   └── pfp/         # PFP Generator page
│   ├── components/      # React components
│   │   ├── bingo/       # Bingo game components
│   │   ├── builder/     # NFT builder components
│   │   ├── ecosystem/   # Ecosystem directory components
│   │   ├── math/        # Moonmath calculator components
│   │   ├── pfp/         # PFP generator components
│   │   └── ui/          # Shared UI components
│   ├── contexts/        # React contexts (Discord auth)
│   ├── data/            # Static data (bingo tasks)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Shared libraries and utilities
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── prisma/              # Database schema and migrations
├── public/              # Static assets
│   ├── avatars/         # Project logos
│   ├── ui/              # UI assets (videos, icons)
│   └── math-tokens/     # Token images for Moonmath
└── scripts/             # Utility scripts
```

## 🛠 Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom brutalist design system
- **UI Components**: [Radix UI](https://www.radix-ui.com/) for accessible primitives
- **Authentication**: Discord OAuth2 with role-based permissions
- **Database**: Prisma with PostgreSQL
- **State Management**: React Hooks and Context API
- **Image Optimization**: Next.js Image component
- **API Integration**: CoinGecko, Hyperliquid, Fluffle Tools API
- **Deployment**: [Vercel](https://vercel.com)

## 🚢 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository
2. Import your repository on [Vercel](https://vercel.com/new)
3. Set up the required environment variables:
   - `DISCORD_CLIENT_ID` - Discord OAuth client ID
   - `DISCORD_CLIENT_SECRET` - Discord OAuth client secret
   - `DISCORD_BOT_TOKEN` - Discord bot token for role verification
   - `DISCORD_REQUIRED_SERVER_ID` - Discord server ID for role checks
   - `DATABASE_URL` - PostgreSQL database connection string
   - `TOKEN_PRICE_API` - API endpoint for token price data
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
