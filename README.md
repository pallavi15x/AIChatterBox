# AIChatterbox

A single-page AI chat application built with **AngularJS** (frontend) and **Express** (backend).

## Project Structure

```
AIChatterbox/
├── backend/
│   ├── routes/
│   │   └── chat.js        ← ✏️  Your AI API call goes here (TODO block)
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js         ← AngularJS module + $routeProvider
│   │   └── controllers.js
│   ├── partials/
│   │   ├── home.html      ← Landing page (dark navy, bot illustration, feature cards)
│   │   └── chat.html      ← Chat UI (bubbles, typing indicator, input box)
│   └── index.html         ← SPA shell — loads once, ng-view swaps partials
└── README.md
```

## How It Works

- `index.html` loads **once**. `ng-view` swaps between the home page and chat page via URL hash (`#!/` and `#!/chat`) — that's AngularJS's `ngRoute` doing the single-page routing.
- The landing page has a dark navy theme, sticky navbar, hero headline, glowing bot illustration in the centre, and feature cards on either side.
- The chat page is a working message UI (bubbles, typing indicator, input box) wired to call `POST http://localhost:5000/api/chat`.
- In `backend/routes/chat.js` there is a clearly marked **TODO block** — that's exactly where you drop in your own AI API call. Right now it echoes your message back so you can test the full flow first.

## Getting Started

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Copy the env template and add your API key
cp .env.example .env
# Open .env and fill in your key (OPENAI_API_KEY, GEMINI_API_KEY, etc.)

# 3. Start the server (serves both API + frontend)
npm start
```

Then open **http://localhost:5000** in your browser.

## Wiring In Your AI Provider

Open `backend/routes/chat.js` and replace the echo block inside the `TODO` comment with your real API call. Example stubs for popular providers are included as comments in that file.

## Development

```bash
# Auto-restart on file changes (requires nodemon, included as devDependency)
cd backend
npm run dev
```
