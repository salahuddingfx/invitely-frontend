# Invitely - Frontend

A modern, feature-rich invitation management platform frontend built with React, TypeScript, and Vite.

## Features

- Create and manage digital invitations for weddings, birthdays, proposals, and more
- Drag-and-drop template builder with live preview
- Multiple event categories (Valentine, Birthday, Wedding, Apology, Proposal)
- Countdown timers and animated invitation layouts
- Payment integration with Stripe
- Responsive design with Tailwind CSS
- State management with Zustand
- Form validation with React Hook Form + Zod
- Smooth animations with Framer Motion & GSAP

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + MUI
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion, GSAP
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **UI Components:** Radix UI

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
git clone https://github.com/salahuddingfx/invitely-frontend.git
cd invitely-frontend
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
client/
├── public/              # Static assets (audio, images, gifs)
├── src/
│   ├── assets/          # Source assets
│   ├── components/      # Reusable UI components
│   │   ├── invitation/  # Invitation-specific components
│   │   └── ui/          # Shared UI components
│   ├── layouts/         # Page layouts
│   ├── mock/            # Mock data
│   ├── pages/           # Route pages
│   │   └── admin/       # Admin pages
│   ├── routes/          # Route configuration
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the **GNU Affero General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Author

**Salah Uddin Kader** - [GitHub](https://github.com/salahuddingfx)
