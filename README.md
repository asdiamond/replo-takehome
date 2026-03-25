# Notion Clone

A simplified Notion clone built with Next.js, Bun, and SQLite. Supports block-based page editing with text blocks (h1, h2, h3, paragraph) and image blocks.

## Prerequisites

- [Bun](https://bun.sh/) (required runtime — Node.js will not work)

SQLite ships with Bun, so no separate database install is needed.

## Getting Started

Install dependencies:

```bash
bun i
```

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Project Structure

```
app/                        # Next.js App Router pages & API routes
  [pageId]/page.tsx         # Individual page view
  api/
    pages/                  # CRUD for pages
    pages/[pageId]/blocks/  # CRUD for blocks within a page
    blocks/[blockId]/       # Update/delete individual blocks
apis/                       # Client-side API layer
  pages/
    api.ts                  # Fetch calls to the backend
    hooks.ts                # React Query hooks
    types.ts                # Shared types
components/                 # React components
server/                     # Server-side database access
  db.ts                     # SQLite connection & schema init
  pages_db.ts               # Page queries
  blocks_db.ts              # Block queries
```

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite via `bun:sqlite` (file: `replo-takehome-asdiamond-db.sqlite`)
- **State Management**: React Query (`@tanstack/react-query`)
- **UI**: Tailwind CSS, shadcn/ui, Radix UI, Lucide icons
