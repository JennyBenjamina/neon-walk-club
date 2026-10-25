# Neon Walk Club website

React (Vite) frontend + Firebase backend (Firestore, Auth, Storage, Hosting) for **neonwalkclub.com**.

Sirkl stays the source of truth for walks and RSVPs. The website embeds the Sirkl calendar instead of keeping a second one.

## What's in the site

| Page | URL | What it does |
|---|---|---|
| Home | `/` | Hero, stats, how-it-works, live calendar, routes, visitor teaser |
| Walks | `/walks` | Embedded Sirkl calendar, themed walks, summer heat schedule, how to RSVP |
| Routes | `/routes` | Interactive map of club routes with distance and time |
| First Walk | `/first-walk` | How to join on Sirkl, what to bring, pace, accessibility, **safety & conduct** |
| Visiting Vegas | `/visiting-vegas` | Guide for tourists joining a single walk |
| Community | `/community` | Photo gallery, member spotlights, milestones, nominate a walker |
| Perks & Merch | `/perks` | Partner perks, become-a-partner form, merch interest form |
| FAQ | `/faq` | FAQ, contact form, newsletter sign-up |
| Admin | `/admin` | Organizer-only: inbox, newsletter list (CSV export), photos, spotlights, partners, routes, settings |

The site works before Firebase is connected: it uses the built-in content in `src/data/fallback.js`, and the forms show a "not switched on yet" note.

## Run it on your computer

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Set up Firebase (about 15 minutes)

### 1. Create the project
1. Go to https://console.firebase.google.com and click **Create a project**. Name it `neon-walk-club`. Google Analytics is optional.
2. Click the **</>** (Web) icon to add a web app, and name it `neon-walk-club-web`. Skip the Hosting checkbox.
3. Firebase shows a `firebaseConfig` block. Copy `.env.example` to `.env.local` and paste each value into the matching `VITE_FIREBASE_…` line.

### 2. Upgrade to Blaze and add a budget alert
Firebase photo storage requires the pay-as-you-go **Blaze** plan. Usage within the free allowance costs $0: 5 GB of stored photos, 100 GB of downloads a month, plus the Firestore and Hosting free quotas. A club site this size stays far below that.

1. In the Firebase console, click **Upgrade** (bottom left) → **Blaze**, and add a billing account.
2. Set a budget alert so you'd hear about any charge right away: go to https://console.cloud.google.com/billing → your billing account → **Budgets & alerts** → **Create budget**. Choose the `neon-walk-club` project, set the amount to **$1**, and keep the 50%, 90% and 100% email alerts.
   - A budget **alerts** you. It doesn't stop spending on its own, but at this site's size you shouldn't see a charge.

### 3. Turn on sign-in
**Build → Authentication → Get started → Sign-in method:**
- Enable **Google**.
- Enable **Email/Password** and switch on **Email link (passwordless sign-in)**.

`localhost` is already an authorized domain. Add `neonwalkclub.com` under **Settings → Authorized domains** when you go live.

### 4. Create the database
**Build → Firestore Database → Create database** → pick a US location → **Start in production mode**.
Then open the **Rules** tab, replace everything with the contents of `firestore.rules`, and click **Publish**.

### 5. Turn on photo storage
**Build → Storage → Get started** → production mode → same location.
Then open the **Rules** tab, paste the contents of `storage.rules`, and click **Publish**. If it asks to grant Storage access to Firestore (used to check who's an organizer), click **Grant**.

### 6. Make yourself an organizer
1. Restart `npm run dev`, go to http://localhost:5173/admin, and sign in with Google.
2. You'll see "Not an organizer yet" and your **user ID**. Click **Copy user ID**.
3. In the Firebase console, go to **Firestore Database → Start collection**. Use `admins` as the Collection ID, paste your user ID as the Document ID, and add a field `email` (string) with your email. Click **Save**.
4. Refresh `/admin`. You're in.
5. Open the **Routes** tab and click **Load starter routes**, then **Settings** to add your Sirkl links.

Add co-organizers the same way: they sign in once, send you their user ID, and you add a document for them in `admins`.

## Add the Sirkl calendar
When Sirkl gives you an embed code, it will look something like `<iframe src="https://…">`. Copy **only the URL inside `src="…"`** and paste it into **/admin → Settings → Sirkl calendar embed URL**. Put your Sirkl invite link in the same screen. Both take effect immediately, with no redeploy.

## Edit content
- **Photos, spotlights, partners, route text, settings:** use `/admin`.
- **Route lines on the map:** in the Firebase console, **Firestore → routes → (route) → path**, a list of `{lat, lng}` points. The starter paths are approximate, so walk each route and adjust.
- **Page wording:** in `src/pages/*.jsx`. Please review the safety, kids and accessibility wording in `FirstWalk.jsx` and `Faq.jsx` so it matches your club's real policies.
- **Colors and fonts:** the variables at the top of `src/styles.css`.
- **Logo:** `public/logo.svg` (full sign) and `public/favicon.svg` (icon). The header logo is in `src/components/Logo.jsx`.

## Put it online (Firebase Hosting)

### Automatic: push to `main`
Every push (or merged pull request) to `main` on GitHub builds the site and deploys it to production through GitHub Actions (`.github/workflows/firebase-hosting-merge.yml`). Pull requests get a temporary preview link instead (`firebase-hosting-pull-request.yml`). Watch progress under the repo's **Actions** tab.

The workflows need two GitHub secrets (**Settings → Secrets and variables → Actions**):

| Secret | What it is |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_NEON_WALK_CLUB` | Lets GitHub deploy to Firebase. Created by `npx firebase-tools init hosting:github`. |
| `ENV_LOCAL` | The full contents of your `.env.local` file (the `VITE_FIREBASE_…` lines). |

### Manual
```bash
npm run build && npx firebase-tools deploy --only hosting          # straight to production
npm run build && npx firebase-tools hosting:channel:deploy preview # temporary preview link
```
To undo a bad release: Firebase console → **Hosting** → release history → **Rollback**.

### Custom domain
Buy the domain (ours is on Namecheap), then in the Firebase console go to **Hosting → Add custom domain** and add the DNS records it shows you in Namecheap → **Advanced DNS** (use `@` as the host for the root domain and `www` for www). Also add the domain under **Authentication → Settings → Authorized domains**.

## Where data lives (Firestore)
| Collection | What |
|---|---|
| `config/site` | Site settings (Sirkl links, contact email, stats) |
| `routes` | Route maps |
| `gallery_photos` | Gallery photos (files in Storage `walks/`) |
| `spotlights` | Member spotlights (photos in Storage `spotlights/`) |
| `partners` | Partner perks |
| `newsletter_subscribers` | Newsletter emails (document ID = email) |
| `messages` | Contact, partner, nomination and merch-interest submissions |
| `admins` | Organizer user IDs |

## Notes
- Map tiles come from CARTO's free dark basemap (© OpenStreetMap contributors).
- Newsletter sign-ups are collected in Firestore. Export the CSV from `/admin` into your email tool to send.
- The forms have a hidden spam trap and are validated by the security rules. If spam becomes a problem, turn on Firebase **App Check**.
