# Culinary Compass

A modern, community-driven recipe sharing platform built with Next.js. Culinary Compass enables home cooks to publish recipes, discover new dishes, manage personal contributions, and build a curated favorites collection—all with a clean, performant, and scalable architecture.

## Why This Project

- Empowers creators to share and manage original recipes.
- Simplifies discovery with powerful search & filtering.
- Encourages engagement through favorites and personalized dashboards.
- Demonstrates a production-ready Next.js App Router + Supabase integration.
- Showcases clean UI composition using reusable component patterns.

## Core Features

- Recipe Browsing & Discovery (search, category, difficulty filters)
- Authenticated Recipe Submission & Editing
- Favorites Management (client-side persistence)
- Dynamic & SEO-Friendly Recipe Pages
- Featured & Related Recipes
- Responsive UI with accessible components

## Tech Stack

- Framework: Next.js (App Router, Server/Client Components)
- Auth & DB: Supabase (PostgreSQL + Storage)
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Animations: Framer Motion

## Key Modules

- Supabase Server Client: [`app/utils/supabase/server.ts`](app/utils/supabase/server.ts)
- Browser Supabase Client: [`app/utils/supabase/client.ts`](app/utils/supabase/client.ts)
- Recipe Services: [`app/services/recipeService.ts`](app/services/recipeService.ts)
- Recipe Submission Form: [`app/components/SubmitRecipeForm.tsx`](app/components/SubmitRecipeForm.tsx)
- Recipe Card UI: [`app/components/RecipeCard.tsx`](app/components/RecipeCard.tsx)
- Filtering UI: [`app/components/RecipeFilterGrid.tsx`](app/components/RecipeFilterGrid.tsx)
- Favorites Logic (localStorage): [`app/api/favoritesAPI.ts`](app/api/favoritesAPI.ts)
- Protected Recipe Management: [`app/my-recipes/page.tsx`](app/my-recipes/page.tsx), [`app/my-recipes/MyRecipesClient.tsx`](app/my-recipes/MyRecipesClient.tsx)

## Architecture Overview

- App Router pages under `app/` use a hybrid Server Component + Client Component strategy.
- Auth state provided globally via [`app/layout.tsx`](app/layout.tsx) and `AuthProvider`.
- Server Actions (e.g. [`app/actions/postRecipeAction.ts`](app/actions/postRecipeAction.ts)) handle secure mutations with revalidation.
- Supabase Storage used for recipe images; public URLs generated post-upload.
- Favorites cached per user session in browser (non-auth dependent).
- Dynamic routes (e.g. recipe detail: [`app/recipe/[slug]/page.tsx`](app/recipe/[slug]/page.tsx)) provide SEO metadata via `generateMetadata`.

## Folder Highlights

- `app/` — Pages, server actions, and composite UI.
- `components/ui/` — Base UI primitives (cards, dialogs, inputs).
- `app/components/` — Feature-level components (forms, grids, sliders).
- `app/api/` — Route handlers (recipes, contact, news, user session).
- `app/services/` — Data transformation and querying abstractions.
- `app/utils/supabase/` — Supabase client creation logic.

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
```

## Image Storage

A Supabase Storage bucket named `recipes` is expected. Uploaded images are made public and linked via generated URLs.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Adding a Recipe (Flow)

1. Authenticate.
2. Navigate to `/submit-recipe`.
3. Complete required fields (title, description, categories, difficulty, steps).
4. Optionally upload an image (validated for size).
5. Submit (handled by [`postRecipeAction`](app/actions/postRecipeAction.ts)).

## Security & Reliability

- Auth via secure Supabase session cookies.
- Server-side validation of form payloads.
- ReCAPTCHA integration for contact form abuse prevention.
- Graceful error boundaries: [`app/error.tsx`](app/error.tsx).
- Protected routes redirect unauthenticated users (e.g. [`app/submit-recipe/page.tsx`](app/submit-recipe/page.tsx), [`app/my-recipes/page.tsx`](app/my-recipes/page.tsx)).

## Performance Considerations

- Suspense-based async data patterns (e.g. filtered recipes via promises).
- Optimized image delivery using Next.js `<Image>` with remote patterns.
- Debounced search updates in filtering UI.
- Minimal client-side state where possible.

## Scripts

- `dev` — Start development server
- `build` — Production build
- `start` — Run production server
- `lint` — ESLint diagnostics

## Planned Enhancements

- User profile editing
- Rating & commenting system
- Social sharing integration
- Advanced nutrition tagging
- Pagination via database queries

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/xyz`
3. Commit changes: `git commit -m "feat: add xyz"`
4. Push: `git push origin feature/xyz`
5. Open Pull Request

Please keep code modular and leverage existing UI primitives.

## License

MIT — Use and adapt freely.

## Acknowledgements

- Supabase for backend simplicity
- shadcn/ui for composable component patterns
- Framer Motion for animation polish

---
Start exploring recipes or share your first creation today.
