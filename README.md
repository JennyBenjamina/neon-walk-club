# Neon Walk Club website

React (Vite) frontend + Supabase backend for **neonwalkclub.com**.

Sirkle stays the source of truth for walks and RSVPs. The website embeds the Sirkle calendar instead of keeping a second one.

## What's in the site

| Page | URL | What it does |
|---|---|---|
| Home | `/` | Hero, stats, how-it-works, live calendar, routes, visitor teaser |
| Walks | `/walks` | Embedded Sirkle calendar, themed walks, summer heat schedule, how to RSVP |
| Routes | `/routes` | Interactive map of club routes with distance and time |
| First Walk | `/first-walk` | How to join on Sirkle, what to bring, pace, accessibility, **safety & conduct** |
| Visiting Vegas | `/visiting-vegas` | Guide for tourists joining a single walk |
| Community | `/community` | Photo gallery, member spotlights, milestones, nominate a walker |
| Perks & Merch | `/perks` | Partner perks, become-a-partner form, merch interest form |
| FAQ | `/faq` | FAQ, contact form, newsletter sign-up |
| Admin | `/admin` | Organizer-only: inbox, newsletter list (CSV export), photos, spotlights, partners, routes, settings |

The site works before Supabase is connected: it uses the built-in content in `src/data/fallback.js`, and the forms show a "not switched on yet" note.

## Run it on your computer

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Connect Supabase (about 10 minutes)

1. Create a free project at https://supabase.com.
2. **SQL Editor → New query**: paste all of `supabase/migrations/0001_init.sql` and click **Run**. Then do the same with `supabase/seed.sql`.
3. **Project Settings → API**: copy the Project URL and the anon (publishable) key.
4. Copy `.env.example` to `.env.local` and paste in both values. Restart `npm run dev`.
5. **Authentication → URL Configuration**: set the Site URL to `http://localhost:5173` for now, and add your live domain later (for example `https://neonwalkclub.com`).

### Make yourself an organizer
1. Go to `/admin`, enter your email, and click the sign-in link in your inbox. You'll see "Not an organizer yet". That's expected.
2. In the Supabase SQL Editor, run this with your email:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
3. Refresh `/admin`. Use the same SQL to add co-organizers after they've signed in once.

## Add the Sirkle calendar
When Sirkle gives you an embed code, it will look something like `<iframe src="https://…">`. Copy **only the URL inside `src="…"`** and paste it into **/admin → Settings → Sirkle calendar embed URL**. Put your Sirkle invite link in the same screen. Both take effect immediately, with no redeploy.

If Sirkle only gives you a share link (no embed), put it in the join-link field. The calendar section will show a button to open Sirkle instead.

## Edit content
- **Photos, spotlights, partners, route text, settings:** use `/admin`.
- **Route lines on the map:** in Supabase **Table Editor → routes → path**, as a list of `[latitude, longitude]` points. The starter paths are approximate, so walk each route and adjust.
- **Page wording:** in `src/pages/*.jsx`. Please review the safety, kids and accessibility wording in `FirstWalk.jsx` and `Faq.jsx` so it matches your club's real policies.
- **Colors and fonts:** the variables at the top of `src/styles.css`.
- **Logo:** `public/logo.svg` (full sign) and `public/favicon.svg` (icon). The header logo is in `src/components/Logo.jsx`.

## Put it online
1. Push this folder to a GitHub repo.
2. Import it on **Vercel** or **Netlify** (both free for a site like this). Build command: `npm run build`. Output folder: `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the host's settings.
4. Buy `neonwalkclub.com` (Cloudflare, Namecheap or Porkbun) and add it as a custom domain in Vercel or Netlify. They show you the DNS records to add.
5. Add the live domain to Supabase **Authentication → URL Configuration**.

`vercel.json` and `public/_redirects` are already set up so links like `/routes` work on refresh.

## Notes
- Map tiles come from CARTO's free dark basemap (© OpenStreetMap contributors).
- Newsletter sign-ups are collected in Supabase. Export the CSV from `/admin` into your email tool to send.
- The forms have a hidden spam trap. If spam becomes a problem, add Cloudflare Turnstile or hCaptcha.
