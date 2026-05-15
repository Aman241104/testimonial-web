# Setup Instructions for College Testimonials

I have initialized your project with the following tech stack:
- **Next.js** (Frontend)
- **Clerk** (Authentication)
- **Convex** (Backend & Database)
- **Tailwind CSS** (Styling)

## Next Steps to Get Running

### 1. Set up Clerk
1.  Go to [Clerk.com](https://clerk.com) and create a new project.
2.  In your dashboard, go to **API Keys** and copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
3.  Go to **JWT Templates**, create a new template for **Convex**, and name it `convex`. Copy the **Issuer URL**.

### 2. Set up Convex
1.  Run the following command in your terminal:
    ```bash
    npx convex dev
    ```
2.  Follow the prompts to create a new Convex project. This will automatically:
    - Create a `.env.local` file with your `NEXT_PUBLIC_CONVEX_URL`.
    - Deploy your schema and functions to Convex.
    - Generate the necessary client code in `convex/_generated/`.

### 3. Connect Clerk and Convex
1.  In your Convex dashboard, go to **Settings** -> **Auth**.
2.  Add a new Auth Provider.
3.  Paste the **Issuer URL** you copied from Clerk.
4.  Set the **Application ID** to `convex`.

Note: I have set up your middleware in `src/proxy.ts` as per your latest guidelines.

### 4. Final Environment Variables
Ensure your `.env.local` has all the following:
```env
NEXT_PUBLIC_CONVEX_URL=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CLERK_JWT_ISSUER_DOMAIN=... (Your Clerk Issuer URL)
```

### 5. Run the App
```bash
npm run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000).
- Users can log in.
- Profiles are automatically created on first login.
- Users can edit their college/bio.
- Users can send testimonials to any other registered user.
- **Privacy Guaranteed:** Testimonials only appear in the recipient's "My Testimonials" section.
