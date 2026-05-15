# Deployment Guide: Testimonial Web (Next.js + Convex + Clerk)

This guide will help you deploy your application to Vercel.

## 1. Prepare Your Environment Variables

You will need to set the following environment variables in your Vercel project settings.

### Required by Next.js (Clerk & Convex Client)
- `NEXT_PUBLIC_CONVEX_URL`: Your Convex deployment URL (e.g., `https://happy-otter-123.convex.cloud`).
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk Publishable Key.
- `CLERK_SECRET_KEY`: Your Clerk Secret Key.

### Required by Convex (Server-side)
*Note: These must be set in the **Convex Dashboard**, not Vercel.*
- `CLERK_JWT_ISSUER_DOMAIN`: Your Clerk Issuer URL (e.g., `https://your-domain.clerk.accounts.dev`).
- `OPENAI_API_KEY`: Required for the moderation feature.

## 2. Deploy to Vercel

### Option A: Using the Vercel Dashboard (Recommended)
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project into Vercel.
3. In the "Environment Variables" section, add the Next.js variables listed above.
4. Click **Deploy**.

### Option B: Using the Vercel CLI
```bash
npm install -g vercel
vercel
```

## 3. Configure Convex for Production

1. Go to your [Convex Dashboard](https://dashboard.convex.dev).
2. Create a new production deployment.
3. Set your environment variables (`CLERK_JWT_ISSUER_DOMAIN`, `OPENAI_API_KEY`) in the Convex Dashboard under **Settings > Environment Variables**.
4. Deploy your Convex functions to production:
   ```bash
   npx convex deploy
   ```

## 4. Final Verification

Once deployed:
1. Verify that the `NEXT_PUBLIC_CONVEX_URL` in Vercel matches your production Convex deployment.
2. Ensure your Clerk application settings include your new Vercel production URL in the "Allowed Redirect URIs" and "Authorized Origins".

## 5. Troubleshooting

- **CORS Errors:** Check Clerk and Convex dashboard settings for allowed origins.
- **Build Failures:** Ensure you have run `npm run build` locally once to ensure all generated files are present, although Vercel will attempt to run this as well.
