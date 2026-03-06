# GoPlay

**Real-time availability for public sports spaces.**

GoPlay tells you whether it's worth going to a public court or field — right now, for the sport you want to play. No more showing up and hoping a court is free.

---

## The Problem

If you want to shoot hoops, hit tennis balls, or play pickup soccer at a public park, you currently have zero visibility before you go. You don't know if the courts are occupied, if the nets are even up, or whether it's going to be dead or packed. GoPlay kills the guesswork.

---

## What GoPlay Does

- **Live busyness heatmap** — See real-time activity at courts and fields, powered by passive and active check-ins from users in the area
- **Sport-specific search** — Filter by sport and location. Not just "parks" — actual basketball courts, tennis courts, pickleball courts, soccer fields
- **Peak hours** — Historical check-in data builds a per-location usage pattern so you can see that a court typically fills up on Tuesday evenings without anyone telling you
- **Player profile** — Log the sports you play, your skill level, and your regular spots. Utility-focused, private in V1

GoPlay V1 is deliberately scoped to **pure utility**. No social feed, no messaging, no game scheduling, no community features.

---

## Check-in System

The check-in system is the engine that powers everything. It runs on two layers:

### Passive Check-in
When a user with location permissions enabled enters the geofence of a known GoPlay facility, they're automatically counted as present. When they leave, they're removed. No taps required.

- Geofence radius of 50–100m per facility, calibrated by space size
- 3-minute dwell threshold to filter out passersby and drive-bys
- Uses iOS significant-change API and Android geofence API — OS-level, negligible battery drain
- Only a binary in/out event is stored — raw coordinates are never persisted

### Active Check-in
When passive arrival is detected, GoPlay fires a push notification asking the user to confirm what they're doing. This is what adds the sport-specific signal beyond just "someone is here."

- Triggers after the 3-minute dwell threshold is met
- Single-tap prompt: *"You're at Volunteer Park — playing tennis? 🎾"*
- Adds sport context (and optionally court/field number for multi-court spaces)
- Check-out is automatic on geofence exit, or manual via an "I'm done" tap

### Privacy

Users can opt for active-only (no passive tracking) or fully manual check-in. Passive location is opt-in during onboarding with a clear explanation. No raw location data is ever stored — only the derived in/out event and its timestamp.

---

## Core Screens

### Map & Search
The primary surface of the app.

- Sport filter bar (Basketball · Tennis · Pickleball · Soccer · Volleyball · Baseball)
- Heatmap overlay with green → yellow → red busyness gradient, updated every 2 minutes
- Sport-specific facility markers with live count badges ("3 here now" / "Quiet" / "Busy")
- Opens centered on user location, 2km radius default
- Search by neighborhood or park name — people think in "Greenlake," not street addresses
- Tapping a marker opens a bottom sheet preview without leaving the map

### Space Detail
Everything you need to decide whether to go.

- **Live status** — Current busyness level, people checked in by sport, last updated timestamp
- **Peak hours** — 24-hour histogram for the current day of week, with a day selector and a "best time to go today" callout
- **Facility info** — Courts/fields per sport, surface type, lighting, accessibility, amenities (parking, restrooms, water, seating)
- **Conditions** — Current weather, rain-in-last-30-minutes flag, sunset time for unlit outdoor spaces
- **Actions** — Save to favorites, manual check-in, get directions, report an issue (broken net, construction — a simple flag, no comments)

### Player Profile
Utility-focused identity. Profiles are private in V1 — not visible to other users.

- **Sports & skill level** — Multi-select sports with Beginner / Intermediate / Advanced / Competitive per sport. Drives the default map filter and is stored for future matchmaking.
- **Home neighborhood** — Biases the map default location
- **Saved spaces** — Tap ♥ on any facility to save it. Tag a spot as a home court for priority notifications.
- **Session history** — Auto-logged from check-ins: sport, location, duration, date
- **Personal stats** — Total sessions, hours played, sport breakdown, weekly/monthly streaks. No leaderboards.

---

## Sport-Specific Facility Data

Each sport has its own set of tracked attributes — this is what makes GoPlay useful beyond a generic maps search.

| Sport | Tracked Attributes |
|---|---|
| Basketball | # of hoops, full/half court, surface type, lighting, nets present |
| Tennis | # of courts, surface type, net condition, lighting, reservable |
| Pickleball | # of courts, permanent vs temp lines, net type, dedicated vs shared |
| Soccer | Field size, surface, goals present, lined, capacity |
| Volleyball | Surface (sand/grass/hard), net present, # of courts |
| Baseball / Softball | Diamond condition, backstop, bases present, lighting, reservable |

---

## Data Sources

Busyness data compounds with every user. On cold-start (new locations with no check-in history), Google Popular Times provides a baseline so the app is useful from day one.

| Source | Role |
|---|---|
| User check-ins (passive + active) | Primary busyness signal |
| Google Places / Popular Times | Baseline for cold-start locations |
| OpenStreetMap + Overpass API | Facility seed data — locations, court counts, sport tags |
| Seattle Parks Open Data (`data.seattle.gov`) | Validates OSM data, adds amenity info |
| OpenWeatherMap | Current conditions and rain flag for outdoor spaces |

Facility data is user-correctable via the issue reporting flow.

---

## Tech Stack

### Mobile App
- **React Native + Expo** — Single codebase for iOS and Android
- **Google Maps SDK** — Map rendering, Places API for facility data
- **Expo Location** — Background geofencing (significant-change on iOS, geofence API on Android)
- **Expo Notifications** — Push delivery for active check-in prompts

### Backend
- **Supabase (Postgres + Realtime)** — Realtime presence updates via websocket subscriptions, auth, all structured data
- **Supabase Edge Functions** — Geofence event processing, check-in aggregation, push triggers
- **PostGIS** — Geospatial queries for radius-based facility search

### Infrastructure
- **Supabase Cloud** — No infrastructure management for V1
- **Expo EAS Build + Submit** — CI/CD for App Store and Play Store, OTA updates for JS-layer fixes

---

## V1 Scope

## Launch City

GoPlay launches in **Seattle, WA**. Seattle has strong open parks data, high density of public sports facilities, and active year-round outdoor sports culture. All facility seeding, geofence calibration, and beta testing will be Seattle-focused before expanding.

---

## Status

🟡 Pre-development — product spec and architecture complete, build not yet started.
