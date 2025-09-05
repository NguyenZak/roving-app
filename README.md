# Roving Vietnam Travel — Next.js 15 (App Router)

Modern travel website with SEO, i18n (vi/en), shadcn/ui, Framer Motion, Redux Toolkit, NextAuth, Prisma/Postgres, and Mapbox.

## Tech
- Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui
- Framer Motion, Redux Toolkit + RTK Query
- Prisma (Postgres)
- next-intl (vi/en), Mapbox GL

## Getting Started
1. Copy env
```
cp docs/ENV.sample .env
```
2. Fill values: DATABASE_URL, NEXT_PUBLIC_MAPBOX_TOKEN, NEXTAUTH_SECRET
3. Install and run (local dev)
```
npm i
npm run prisma:generate
npx prisma migrate deploy
npm run dev
```

## Prisma
- Edit `prisma/schema.prisma`, then:
```
npx prisma migrate dev --name init
npx prisma studio
```
### Seed admin user
Create a `.env` admin credentials and run seed script below.


## Scripts
- `dev`, `build`, `start`
- `prisma:generate`, `prisma:migrate`, `prisma:studio`

## Deploy (Vercel)
- Set same envs in Vercel Project Settings
- Build Command: `npm run build`
- Output: `.next`

## SEO
- Next Metadata API: title/description, Open Graph, sitemap, robots
- JSON-LD: Organization, LocalBusiness, TouristAttraction

## i18n
- Locale routes: `/vi/*`, `/en/*`
- Language switcher in navbar

## Notes
- One H1 on homepage (Hero). Other sections use H2/H3
- All images have alt attributes
