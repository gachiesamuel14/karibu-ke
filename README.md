# Karibu KE

Location-based matchmaking for people in Kenya.

Live demo: https://karibu-ke.netlify.app

## What this demo includes

- Landing page with Kenyan localization
- Register / login (stored in your browser)
- Profile setup (county, tribe, religion, mode, interests)
- Discover feed with distance + county filters
- Like / pass swipe cards
- Matches list
- In-browser chat
- Report / safety flow
- Premium + M-Pesa payment tease (UI only)

This is a **frontend MVP**. Auth, GPS, chat, photos, and payments are simulated so you can ship the look and flow on Netlify today.

## Next production steps

1. Add a backend (Supabase or Firebase) for real users, photos, and chat.
2. Request geolocation and store coordinates; rank by Haversine distance.
3. Wire Safaricom Daraja STK Push for premium.
4. Add Cloudinary for photo uploads and moderation.
5. Connect GitHub → Netlify continuous deploy (already the hosting target).

## Local

Open `index.html` or run any static server from this folder.
