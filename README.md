# Culinary Compass

A community-driven recipe sharing platform built with Next.js. Share your favorite recipes, discover new dishes, and connect with fellow food enthusiasts.

## Features

- **Browse Recipes**: Explore a wide variety of community-submitted recipes
- **Submit Recipes**: Share your own culinary creations with the community
- **User Authentication**: Create an account to submit and manage your recipes
- **Favorites**: Save your favorite recipes for easy access
- **Recipe Management**: Edit and update your submitted recipes
- **Search & Filter**: Find recipes by category, difficulty, and more

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

This is a community project! Feel free to contribute by:
- Submitting bug reports
- Proposing new features
- Improving documentation
- Submitting pull requests

## License

MIT License - feel free to use this project for your own community recipe platform!
