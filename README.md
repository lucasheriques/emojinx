This is [emojinx](http://emojinx.lucasfaria.dev/), an emoji-themed multiplayer matching game.

It features:

- Single player and multiplayer mode
- Custom game settings (length, emoji categories, password protected, turn timer)
- Online presence
- Automatically skip offline players turns
- Animations and sounds

It's easy to setup, doesn't require login, just open it, create a room, invite your friends and enjoy!

# The Tech

It's made using a NextJS frontend (using app router but almost no server components) and Convex, which is a TypeScript-first real-time backend.

The frontend is deployed on Vercel.

## Getting Started

First, run Convex backend service:

```bash
npx convex dev
```

Then, run NextJS development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Known Issues

For some reason, the `use-presence.ts` hook was not working properly when testing from my Windows PC, which caused weird behaviors between clients.

It worked fine using Chrome on iOS, Android and MacOS, but Windows did not work using any browser. Maybe it's an isolated issue with my personal PC,
but if you join a room from a PC and everyone else appears to be offline I recommend trying a different client.

I'll try to pinpoint this issue later.
