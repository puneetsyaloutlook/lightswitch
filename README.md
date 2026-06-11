# Light switch

A minimal Next.js app with a tactile light switch that speaks the state ("on" / "off") via ElevenLabs TTS.

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy the env example and add your ElevenLabs API key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
ELEVENLABS_API_KEY=your_api_key_here
```

3. Run locally:

```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add `ELEVENLABS_API_KEY` as an environment variable in the Vercel project settings.
4. Deploy.

The API key is only ever used server-side (the `/api/speak` route), so it is never exposed to the browser.

## How it works

- The switch component calls `/api/speak` with `"on"` or `"off"` on each toggle.
- The API route proxies to the ElevenLabs `/v1/text-to-speech` endpoint and streams the audio back as `audio/mpeg`.
- The browser plays the audio via the Web Audio API (`new Audio(objectURL)`).
- The voice used is Rachel (voice ID `21m00Tcm4TlvDq8ikWAM`), which can be swapped in `app/api/speak/route.ts`.
