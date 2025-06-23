# Hiro Express Sushi Delivery Website

## Project Structure

```
hiro-express/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── favicon.ico
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── sushi-hero.jpg
│   │   │   └── offline.html
│   │   └── sw.js
│   ├── src/
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   └── telegram.js
│   │   └── assets/
│   │       └── products.json
│   └── package.json
├── server/
│   ├── src/
│   │   ├── index.js
│   │   └── telegramBot.js
│   ├── .env
│   └── package.json
├── nginx/
│   └── nginx.conf
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Setup Instructions

1. **Install Dependencies**:
   - For client: `cd client && npm install`
   - For server: `cd server && npm install`
2. **Configure Environment**:
   - Create a Telegram bot via BotFather and get the token.
   - Get the group ID for the operators' chat.
   - Update `server/.env` with `TELEGRAM_BOT_TOKEN` and `TELEGRAM_GROUP_ID`.
3. **Build and Run**:
   - Run `docker-compose up --build` to start the application.
4. **Access the App**:
   - Open the Telegram Mini App via the bot link or visit `http://localhost` for testing.
5. **PWA Setup**:
   - Ensure `manifest.json` and `sw.js` are correctly served.
   - Test offline mode by accessing `/offline.html`.

## Design Notes

- **Typography**: Uses Inter font for modern, clean text.
- **Color Scheme**: Red (#EF4444) for CTAs, white background, gray for secondary elements.
- **Animations**: Microanimations on hover (scale transform) and pulse effect for key buttons.
- **Responsive**: Tailwind's responsive classes ensure compatibility across devices.
- **Gamification**: Progress bar for free delivery and bonus alerts in the cart.
- **Performance**: PWA with service worker for offline support and fast loading.

## Deployment

- Deploy using Docker Compose for local testing or a cloud provider (e.g., AWS ECS, DigitalOcean).
- Ensure environment variables are securely managed in production.
- Use a reverse proxy (nginx) to handle client and API requests efficiently.
