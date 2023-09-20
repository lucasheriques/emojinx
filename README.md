This is [emojinx](http://emojinx.lucasfaria.dev/), an emoji-themed multiplayer matching game.

It features:

- Single player and multiplayer mode
- Custom game settings (length, emoji categories, password protected, turn timer)
- Online presence
- Automatically skip offline players turns
- Animations and sounds

It's easy to setup, doesn't require login, just open it, create a room, invite your friends and enjoy!

[Check the demo here](https://www.loom.com/share/e7dee280db8d4c1788312de7b4a24337?sid=b78564c0-08f7-4bf6-adf9-99008843e23f).

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
