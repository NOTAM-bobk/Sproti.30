# 🎵 Sproti — Pure Music

A self-contained, single-file PWA music player built with vanilla HTML, CSS, and JavaScript. Stream song previews, browse live radio, discover podcasts, manage playlists, and chat with an AI music assistant — all from one file, zero build step required.

---

## ✨ Features

### 🎧 Music Playback
- Stream **30-second song previews** via iTunes or Deezer
- Smooth **fade in / fade out** transitions between tracks
- Full-screen player with **album art**, progress bar, and lyrics
- **Mini player** that persists while browsing
- **Shuffle**, **Repeat**, and **Autoplay** controls
- Skip forward / backward through a queue

### 🔍 Discovery & Search
- **Trending songs** loaded on home screen
- **Discover tab** with genre chips: Hits, Pop, Chill, Hip Hop, R&B, Electronic, Country, Rock, Indie
- **Infinite scroll** on all song lists
- Live **search** with debounce and recent search history
- Browse songs by **artist** (Drake, Taylor Swift, The Weeknd, Billie Eilish, Post Malone)

### 📻 Live Radio
- Powered by the **RadioBrowser API** — thousands of stations worldwide
- Search stations by name, genre, or language
- Infinite scroll through results

### 🎙️ Podcasts
- Trending episodes fetched via **Taddy API**
- Falls back to **iTunes Podcast API** automatically if Taddy is unavailable
- Grid layout with full episode playback

### ❤️ Library & Playlists
- **Save tracks** to favorites with one tap
- **Create custom playlists** and add any song to them
- Recently played history on home screen
- Library shortcuts on home screen

### 🤖 AI Music Assistant
- Chat interface powered by **Groq (LLaMA 3.1)**
- Ask for recommendations, trending songs, artist info, and more
- Quick-suggest chips for common prompts

### ☁️ Cloud Sync
- Optional backup/restore using a **Cloudflare KV Worker**
- Syncs: favorites, playlists, recently played, recent searches, and settings
- Keyed by your display name — no account required

### 🎨 UI & UX
- **Neobrutalist** design system with bold borders and offset shadows
- **Light and Dark mode** toggle
- Color-extracted **dynamic player background** pulled from album art
- Animated screen transitions and skeleton loading states
- **PWA-ready** — installable on iOS and Android home screens

### 📊 Listening Stats
- Tracks total songs played and minutes listened
- Displayed on the Account screen, persisted in localStorage

---

## 🚀 Getting Started

No build tools, no npm, no server required.

1. **Download** or clone this repo
2. Open `index.html` in any modern browser
3. That's it — it works immediately with default API keys included

To host it, upload the single `index.html` file to any static host:
- **Cloudflare Pages** (recommended)
- GitHub Pages
- Netlify / Vercel
- Any web server or CDN

---

## 🔑 API Keys

All keys are stored in `localStorage` and can be changed at runtime from the **Account → Services & API Keys** section in the app.

To change the **defaults** baked into the file, find and update the following lines near the top of the `<script>` block:

```js
let customGroqKey   = localStorage.getItem('sproti_groq_key')   || 'YOUR_GROQ_KEY_HERE';
let customTaddyKey  = localStorage.getItem('sproti_taddy_key')  || 'YOUR_TADDY_KEY_HERE';
```

| Key | Where to get it | Used for |
|---|---|---|
| **Groq API Key** | [console.groq.com](https://console.groq.com) | AI chat (LLaMA 3.1) |
| **Taddy API Key** | [taddy.org](https://taddy.org) | Podcast discovery |

> The Groq free tier is generous and sufficient for personal use. Taddy's free tier covers basic podcast search. Both keys can also be entered at runtime in the app — no code editing needed.

### Keys that require NO setup
The following services are used with their **free public endpoints** and need no API key:

| Service | Used for |
|---|---|
| iTunes Search API | Music search, song previews, cover art, artist images |
| Deezer API (via CORS proxy) | Alternative song previews |
| RadioBrowser API | Live radio stations |
| LRCLib API | Song lyrics |

---

## ☁️ Cloud Sync Setup (Optional)

Sproti can back up and restore your data across devices using a **Cloudflare Worker + KV store**.

### Deploy the Worker

1. Create a **KV namespace** in your Cloudflare dashboard (name it anything, e.g. `SPROTI_KV`)
2. Create a new **Worker** and paste the code below
3. Bind the KV namespace to the Worker with the variable name `KV`
4. Copy your Worker URL (e.g. `https://my-sproti.workers.dev`) into the app under **Account → Cloud Sync**

```js
// Cloudflare Worker — paste into your Worker editor
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers });

    if (request.method === 'POST' && url.pathname === '/sync') {
      const body = await request.json();
      const { username, data } = body;
      if (!username || !data) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers });
      await env.KV.put(username.toLowerCase(), JSON.stringify(data));
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    if (request.method === 'GET' && url.pathname === '/sync') {
      const username = url.searchParams.get('username');
      if (!username) return new Response(JSON.stringify({ error: 'Missing username' }), { status: 400, headers });
      const data = await env.KV.get(username.toLowerCase());
      if (!data) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
      return new Response(data, { headers });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  }
};
```

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| Vanilla HTML / CSS / JS | Everything — no framework |
| Tailwind CSS (CDN) | Utility styling |
| Ionicons | Icons |
| Google Fonts (Space Grotesk + Poppins) | Typography |
| Web Audio API (`<audio>`) | Playback |
| Intersection Observer API | Infinite scroll |
| localStorage | All persistence (favorites, playlists, settings, stats) |
| Canvas API | Album art color extraction |

---

## 📁 Project Structure

```
sproti/
└── index.html   ← The entire application (HTML + CSS + JS in one file)
```

---

## ⚙️ Settings Reference

All settings are accessible in-app under the **Account** tab and are persisted in `localStorage`.

| Setting | Default | Description |
|---|---|---|
| Dark Mode | Off | Toggles dark color theme |
| Autoplay Next Song | On | Automatically plays next track when one ends |
| Music API Source | iTunes | Switch between iTunes and Deezer for previews |
| Display Name | User | Used for greeting and cloud sync key |
| Groq API Key | Built-in | For AI chat feature |
| Taddy API Key | Built-in | For podcast discovery |
| Worker URL | Built-in example | Your Cloudflare Worker endpoint for cloud sync |

---

## 📱 PWA Installation

Sproti is a fully configured Progressive Web App.

- **iOS**: Open in Safari → Share → Add to Home Screen
- **Android**: Open in Chrome → Menu → Install App / Add to Home Screen

The installed app runs in standalone mode with no browser chrome.

---

## 📄 License

MIT — use it, fork it, build on it freely.
