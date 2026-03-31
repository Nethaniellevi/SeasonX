# SeasonX — Verified Ticket Marketplace

A premium ticket resale platform exclusively for verified season ticket holders.

- **Sellers:** $50/month flat subscription, 0% seller fees, 14-day free trial
- **Buyers:** Flat 3% buyer fee (3–5× lower than competitors)
- **Trust:** Every seller is manually verified as a season ticket holder

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 App Router + TypeScript |
| Styling | Tailwind CSS v4 + shadcn-style components |
| Auth | Clerk v7 |
| Database | PostgreSQL + Prisma 7 |
| Payments | Stripe (Checkout + Billing + Connect) |
| Email | Resend |
| Deployment | Vercel + Neon/Supabase |

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in all values in `.env`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon, Supabase, or local PostgreSQL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks |
| `STRIPE_SELLER_SUBSCRIPTION_PRICE_ID` | Stripe Dashboard → Products (create $50/mo product) |
| `RESEND_API_KEY` | Resend Dashboard |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |

### 3. Set up database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000.

---

## Stripe Setup

### Create subscription product

1. Go to Stripe Dashboard → Products
2. Create a product: "SeasonX Seller Plan"
3. Add a price: $50/month recurring
4. Copy the Price ID (starts with `price_`) → set as `STRIPE_SELLER_SUBSCRIPTION_PRICE_ID`

### Set up webhooks

Run the Stripe CLI locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret → set as `STRIPE_WEBHOOK_SECRET`.

For production, create a webhook in Stripe Dashboard pointing to:
`https://yourdomain.com/api/webhooks/stripe`

Events to subscribe to:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

---

## Clerk Setup

### Configure URLs

In Clerk Dashboard → Configure:

- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in: `/dashboard`
- After sign-up: `/onboarding`

### Set up webhook

In Clerk Dashboard → Webhooks, create a webhook pointing to:
`https://yourdomain.com/api/webhooks/clerk`

Subscribe to: `user.created`, `user.updated`, `user.deleted`

Copy the signing secret → set as `CLERK_WEBHOOK_SECRET`.

---

## Make a User Admin

After signing up, run this in your database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Admins can access `/admin/verifications` to review seller applications.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env`
4. Deploy

For the database, use [Neon](https://neon.tech) (free tier) or [Supabase](https://supabase.com).

---

## Project Structure

```
seasonx/
├── app/
│   ├── (auth)/sign-in, sign-up     # Clerk auth pages
│   ├── actions/                    # Server Actions
│   │   ├── seller-actions.ts       # Listings, verification submission
│   │   ├── purchase-actions.ts     # Checkout, transfers, disputes
│   │   ├── subscription-actions.ts # Stripe subscription management
│   │   └── admin-actions.ts        # Approve/reject verifications
│   ├── admin/verifications/        # Admin review dashboard
│   ├── api/webhooks/               # Stripe + Clerk webhook handlers
│   ├── dashboard/                  # Buyer dashboard
│   ├── listings/[id]/              # Listing detail + checkout
│   ├── marketplace/                # Browse + filter listings
│   ├── onboarding/                 # Post-signup flow
│   └── seller/                     # Seller verify, dashboard, subscription
├── components/
│   ├── ui/                         # Button, Card, Input, Badge, etc.
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── verified-badge.tsx
├── lib/
│   ├── auth.ts                     # getOrCreateUser, requireAuth, etc.
│   ├── prisma.ts                   # PrismaClient singleton
│   ├── stripe.ts                   # Stripe lazy init
│   └── resend.ts                   # Email helpers
└── prisma/
    └── schema.prisma               # Full data model
```

---

## Phase 2 Roadmap

- **Native app:** Convert to React Native (shared logic) or publish as TWA from PWA
- **Auto-sync:** Connect directly to Ticketmaster/AXS seller APIs
- **Seat maps:** Interactive venue map browsing
- **Seller analytics:** Revenue charts, sell-through rates
- **In-app chat:** Buyer ↔ seller messaging
- **Corporate accounts:** Multi-seat org support for corporate STHs
- **Price recommendations:** ML-based pricing suggestions
- **Stripe Connect:** Direct payouts to seller bank accounts
