# Prompt for Manus

This repository is an Expo SDK 57 / React Native 0.86.3 Arabic RTL Ludo app called Ludo Majlis.

Keep the existing game UI and game logic. Add production-ready AI support without exposing any provider API key in the mobile app.

Requirements:
1. Keep `src/ai.ts` as the mobile AI client. It calls `EXPO_PUBLIC_AI_API_URL/chat`.
2. Keep provider secrets only on the server (`AI_API_KEY`).
3. Use the included `api/server.mjs` as the minimal Node AI gateway, or replace it with Manus backend infrastructure while preserving the same POST `/chat` contract.
4. AI should support Arabic chat, Ludo rules, room help, and strategy explanations.
5. Add board-state context later through a structured JSON field; do not pretend the AI can see the board unless state is supplied.
6. Keep RTL UI and iOS/Android compatibility.
7. Run typecheck and Expo doctor before publishing.
8. Do not remove existing game features.
