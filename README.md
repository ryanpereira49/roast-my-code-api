# Roast My Code API 🔥

A brutally honest REST API built with Hono and Google's Gemini 2.5 Flash that takes in code snippets and returns savage, humorous roasts. Perfect for "vibe coding" and building a funny frontend to humiliate your friends' (or your own) code. 

## Getting Started

1. Clone this repository
2. Run `npm install`
3. Create a `.env` file from the `.env.example` and insert your API Key: `GEMINI_API_KEY=your_key_here`
4. Start the server: `npm run dev`

The server will be running on `http://localhost:3000`.

## API Documentation

### `POST /roast`

Sends a code snippet to Gemini and returns a roast based on the provided parameters. **CORS is fully enabled**, meaning you can call this directly from any frontend application.

#### Request Body (JSON)

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `code` | string | **Yes** | The code snippet you want roasted. |
| `niceness` | integer | No | Scale of `1` (Savage) to `10` (Gentle). Defaults to `1`. |
| `persona` | string | No | The identity the AI should adopt (e.g., "Gordon Ramsay", "Linus Torvalds"). Defaults to "Senior Developer". |
| `language_hate` | boolean | No | If `true`, viciously insults the programming language itself. |
| `focus` | string | No | A specific aspect to target (e.g., "readability", "performance"). |
| `one_liner` | boolean | No | If `true`, returns a single, devastating sentence. |
| `emoji_toxicity` | int | No | Level `1` to `3`. Injects passive-aggressive or highly toxic emojis. |

#### Example Request

```json
POST http://localhost:3000/roast
Content-Type: application/json

{
  "code": "function isEven(n) { return n % 2 === 0 ? true : false; }",
  "niceness": 1,
  "persona": "Gordon Ramsay",
  "language_hate": true,
  "emoji_toxicity": 3
}
```

#### Example Response

```json
{
  "roast": "ARE YOU ABSOLUTELY JOKING ME?! 😭💀 JAVASCRIPT?! You chose a language where `[] + []` is `\"\"` and stringing together a bunch of `if` statements is your idea of logic?! 🗑️🤡 This readability is a disaster! It’s like a toddler threw alphabet spaghetti at the wall and called it a masterpiece! 📉🤦‍♂️ If I had to read this garbage every day, I’d gauge my eyes out! 🤬 IT’S RAW, IT’S PATHETIC, AND IT’S A TOTAL INSULT TO CODING! GET OUT! 🚪💨"
}
```

## Deployment

For detailed instructions on how to deploy this API to a Linux VPS (Ubuntu/Debian) using PM2 and Nginx, please refer to the [Deployment Guide](./deployment_guide.md).

Quick start:
1. `npm run build`
2. `pm2 start dist/index.js --name "roast-api"`
