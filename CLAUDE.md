# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Lista de Compras" (Shopping List) — a small React + TypeScript + Vite MVP backed by Supabase (Postgres). No authentication: the app uses the Supabase `anon` key with RLS policies that grant full access to anyone. UI copy and user-facing strings are in Portuguese.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) and build for production
- `npm run preview` — preview the production build locally

There is no lint script and no test suite configured in this repo.

## Environment setup

Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project (Project Settings → API). `src/lib/supabaseClient.ts` throws at import time if either is missing.

## Database

Schema lives in `supabase/migrations/0001_create_items.sql` and must be run manually in the Supabase SQL Editor (there is no migration runner/CLI wired up). It defines the single `public.items` table (`id`, `name`, `quantity`, `checked`, `created_at`, `updated_at`), an `updated_at` trigger, and an RLS policy granting the `anon` role full CRUD access. When changing the schema, add a new numbered migration file rather than editing the existing one, and keep `src/types/item.ts` (`Item`, `ItemDraft`) in sync with the columns.

## Architecture

- `src/hooks/useItems.ts` is the single data-access layer: it wraps all Supabase calls (fetch/add/update/toggle/delete/deleteAll) for the `items` table, keeps local React state in sync with the DB response on every mutation, and centralizes list sorting (unchecked items first, then alphabetical by name via `sortItems`). Any new item-related operation should be added here rather than calling `supabase` directly from components.
- `src/App.tsx` is the sole consumer of `useItems` and owns the single piece of cross-component UI state: `editingItem`. It decides whether a form submission is an add or an update based on whether an item is being edited.
- `src/components/ItemForm.tsx` is a dual-purpose form (add vs. edit) driven entirely by the `editingItem` prop; it does local validation (non-empty name, positive integer quantity) before calling `onSubmit`, and resets its local state via a `useEffect` keyed on `editingItem`.
- `src/components/ItemRow.tsx` renders a single item with toggle/edit/delete actions; deletion confirms via `window.confirm`.
- Styling is Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no `tailwind.config.js` — configured through the Vite plugin and `@import "tailwindcss"` in `src/index.css`).

## Auto-backup hook

`.claude/settings.json` registers a `Stop` hook that runs after each Claude Code turn: it stages all changes (`git add -A`) and, if anything is staged, commits and pushes to `origin master`. This means work in this repo is auto-committed and auto-pushed to the remote — be aware that local changes will not stay uncommitted/unpushed between turns.

The commit message is generated from the staged diff by piping it into a headless `claude -p --safe-mode --model haiku` call, so commits get a real one-line conventional-commits-style summary instead of a generic message. `--safe-mode` is required here: it disables hooks (and CLAUDE.md/plugins) for that sub-invocation, which prevents it from re-triggering this same Stop hook recursively. If message generation fails or returns empty (e.g. `claude` unavailable, not logged in), the hook falls back to `chore: auto-backup <timestamp>`. Don't remove `--safe-mode` from this hook or route it through anything that re-enables hooks — doing so causes the sub-invocation's own Stop hook to fire and commit/push again recursively.
