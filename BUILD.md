# Ludo Private — build & modification notes

## Project
- Expo SDK 57
- React Native 0.86.3
- React 19.2.3
- TypeScript 6.0.3
- Entry point: `index.ts`
- Main UI/game logic: `App.tsx`

## Important
The uploaded archive had an incomplete `node_modules` directory in the working environment. It is **not** included in the prepared source archive. Install dependencies from `package-lock.json` before running checks.

Expo SDK 57 targets React Native 0.86 and requires Node.js 22.13.x or newer.

## Setup
```bash
npm ci
npm run typecheck
npm run doctor
```

If dependency installation reports a version mismatch:
```bash
npx expo install --fix
npm run doctor
```

## Run
```bash
npm start
```

For native projects, Expo can generate `ios/` and `android/` from the app config:
```bash
npx expo prebuild
```

## EAS builds
```bash
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile preview
```

For store builds:
```bash
npx eas-cli@latest build --platform android --profile production
npx eas-cli@latest build --platform ios --profile production
```

## Current application state
`App.tsx` is a single-screen prototype containing the Ludo board, local room list, local chat, share invitation, and an in-app AutoTouch-style test loop. The current room/chat/voice state is local UI state; it is not a real multiplayer backend or real microphone implementation.

## Before production
1. Add a real authentication/backend layer if online multiplayer is required.
2. Add real-time room synchronization and server-side game state validation.
3. Add a real audio/voice implementation if voice chat is required.
4. Test iOS and Android on physical devices.
5. Run `npm run typecheck` and `npm run doctor` after every dependency/config change.
