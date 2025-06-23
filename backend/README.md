### server/src/index.js

```javascript
const express = require("express");
const cors = require("cors");
const { sendOrderToTelegram } = require("./telegramBot");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/order", async (req, res) => {
  const { user, order, total } = req.body;
  const message = `
    Новый заказ от ${user?.first_name || "Неизвестно"}:
    ${order}
    Итого: ${total} ₽
  `;
  try {
    await sendOrderToTelegram(message);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send order" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### server/src/telegramBot.js

```javascript
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

exports.sendOrderToTelegram = async (message) => {
  await bot.sendMessage(process.env.TELEGRAM_GROUP_ID, message);
};
```

### server/.env

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_GROUP_ID=your_group_id_here
PORT=3000
```

### nginx/nginx.conf

```
server {
  listen 80;
  server_name localhost;

  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://server:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### Dockerfile

```dockerfile
# Client build
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package.json .
RUN npm install
COPY client .
RUN npm run build

# Server build
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package.json .
RUN npm install
COPY server .

# Final image
FROM nginx:alpine
COPY --from=client-build /app/client/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=server-build /app/server /app/server
RUN apk add --no-cache nodejs npm
WORKDIR /app/server
CMD ["sh", "-c", "node src/index.js & nginx -g 'daemon off;'"]
```

### docker-compose.yml

```yaml
version: "3.8"
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_GROUP_ID=${TELEGRAM_GROUP_ID}
    volumes:
      - ./server/.env:/app/server/.env
```
