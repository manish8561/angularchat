# Chatlive

Chatlive is a small real-time support chat application built with Angular and
Socket.IO. Visitors identify themselves with a name and room ID, then use the
chat launcher to connect with the support team.

## Requirements

- Node.js and npm
- A browser supported by the current Angular CLI

## Installation

Install dependencies for both the Angular app and the Socket.IO server:

```bash
npm install
cd server
npm install
cd ..
```

## Run locally

Start the chat server in one terminal:

```bash
cd server
npm start
```

The server listens on port `3000` by default. Set `PORT` to use another port.

Start the Angular app in a second terminal from the project root:

```bash
npm start
```

Open `http://localhost:4200` in a browser.

## Using the app

1. Enter a display name and a numeric room ID on the home page.
2. Select **Enter chat**.
3. Open the chat launcher in the lower-right corner to send messages.
4. Use the same room ID in another browser session to test a shared conversation.

Room `1` is configured as the administrator room. Other room IDs act as visitor
rooms.

## Configuration

The Socket.IO connection and administrator settings are configured in
`src/app/app.module.ts`:

```ts
ChatliveModule.forRoot({
  url: "http://localhost:3000",
  admin_room: 1,
  room: "default",
  username: "admin",
});
```

When the server runs on another host, update `url` to that host before starting
the Angular app. The server allows cross-origin Socket.IO connections for local
development.

## Commands

| Command                  | Purpose                              |
| ------------------------ | ------------------------------------ |
| `npm start`              | Start the Angular development server |
| `npm run build`          | Build the Angular application        |
| `npm test`               | Run Angular unit tests               |
| `npm run lint`           | Run TSLint                           |
| `npm run e2e`            | Run end-to-end tests                 |
| `cd server && npm start` | Start the Socket.IO server           |

## Project structure

- `src/app/` - Angular application and chat widget
- `src/app/components/chatlive/` - Chat UI and Socket.IO client service
- `server/server.js` - Express and Socket.IO server
- `e2e/` - Protractor end-to-end tests
