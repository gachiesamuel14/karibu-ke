# Karibu

Location-based matchmaking for adults in Kenya. People create a profile, share a county or GPS point, then swipe, match, and chat with people nearby.

Live site target: https://karibu-ke.netlify.app

Repository: https://github.com/gachiesamuel14/karibu-ke

## Demo login

- Email: `demo@karibu.ke`
- Password: `karibu123`

New accounts stay in this browser only (`localStorage`). Clearing site data resets the demo.

## What works in this MVP

1. Registration and login, with an 18+ age gate
2. Profile setup: photos as local uploads, bio, county, tribe, religion, mode, interests
3. GPS permission, with county centroids as a fallback
4. Nearby ranking with the Haversine formula, plus filters for county, distance, age, tribe, religion, mode, and interests
5. Like / pass, mutual matches
6. Chat stored in the browser, with a short demo reply
7. Photo upload preview
8. In-app notifications
9. Report and block
10. Karibu Plus screen with an M-Pesa STK tease (no real charge)

## Production path

Netlify hosts the frontend. Real accounts, photos, and chat need a backend:

- Auth + database: Supabase (Postgres, storage, realtime) or Firebase
- Photos: Supabase Storage or Cloudinary, with moderation before profiles go live
- Maps: browser Geolocation API is enough to start; Google Maps is optional for a map view
- Payments: Safaricom Daraja STK Push for Karibu Plus
- Chat: Supabase Realtime or a websocket service
- Deploy: connect this GitHub repo to the Netlify site `karibu-ke` so every push to `main` publishes

Do not ship the localStorage auth to real users. It is a prototype only.
