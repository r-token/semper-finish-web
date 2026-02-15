# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Semper Finish is a business website for a painting and handyman services company in St. Louis. Built with SvelteKit 5 and deployed to AWS via SST (Serverless Stack).

## Commands

- **Local development**: `npx sst dev` (runs SvelteKit with SST)
- **Type checking**: `npm run check` or `npm run check:watch`
- **Build**: `npm run build`
- **Deploy to prod**: `npx sst deploy --stage prod`

## Architecture

### SST Infrastructure (`sst.config.ts`)
- Deploys to AWS using the `personal` profile in `us-east-1`
- **SvelteKit site**: Main website with auto-deployed domain (semperfinishllc.com in prod)
- **API Gateway**: Two Lambda endpoints for form submissions:
  - `POST /booking-request` - Handles booking form submissions
  - `POST /testimonial` - Handles customer testimonial submissions
- Both endpoints send emails via AWS SES and post to Slack channels
- Secrets managed via SST: `BookingApiSecret`, `TestimonialApiSecret`, `SlackBotToken`

### SvelteKit App (`src/`)
- **Routes**: Home, Meet the Team, Book with Us, Customer Testimony, Job Gallery
- **Server handlers** (`src/lib/server/`): Lambda functions for API endpoints, CSRF protection, form utilities
- **Components** (`src/lib/components/`): Reusable UI components (Header, Navbar, forms, modals, gallery)

### Styling
- Tailwind CSS v4 with CSS-based theming in `src/app.css`
- Brand colors: primary red (#CC101F), blue (#004481), gold (#A77C29), yellow (#FFD500)
- Dark mode supported via `dark:` variants

## Deployment

- SST Console auto-deploys `main` branch to `prod` stage
- Monitor at: https://console.sst.dev/ryan-token/semper-finish
- Node version: 22.12.0 (see `.nvmrc`)
