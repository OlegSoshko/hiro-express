### client/public/index.html

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#ffffff" />
    <title>Hiro Express</title>
    <link rel="stylesheet" href="/css/styles.css" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/favicon.ico" />
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
  </head>
  <body class="bg-white font-sans">
    <header class="sticky top-0 bg-white shadow-md z-10">
      <div
        class="container mx-auto px-4 py-3 flex justify-between items-center"
      >
        <img src="/images/logo.png" alt="Hiro Express" class="h-10" />
        <button
          id="cartBtn"
          class="relative bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition transform hover:scale-105"
        >
          Корзина (<span id="cartCount">0</span>)
        </button>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <!-- Hero Section -->
      <section class="mb-8">
        <img
          src="/images/sushi-hero.jpg"
          alt="Sushi Hero"
          class="w-full rounded-lg shadow-lg"
        />
        <h1 class="text-3xl font-bold mt-4 text-gray-800">
          Hiro Express — Вкус Японии
        </h1>
        <p class="text-gray-600">
          Быстрая доставка суши и роллов в вашем городе!
        </p>
        <button
          class="mt-4 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition transform hover:scale-105"
        >
          Заказать сейчас
        </button>
      </section>

      <!-- Promotions -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Акции</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            class="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 class="text-lg font-semibold">Сет на двоих -10%</h3>
            <p class="text-gray-600">Только сегодня!</p>
          </div>
          <div
            class="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 class="text-lg font-semibold">Бесплатная доставка</h3>
            <p class="text-gray-600">При заказе от 1000 ₽</p>
          </div>
        </div>
      </section>

      <!-- Catalog -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Меню</h2>
        <div class="flex space-x-4 mb-4 overflow-x-auto">
          <button
            class="category-btn bg-red-500 text-white px-4 py-2 rounded-full"
            data-category="all"
          >
            Все
          </button>
          <button
            class="category-btn bg-gray-200 text-gray-800 px-4 py-2 rounded-full"
            data-category="rolls"
          >
            Роллы
          </button>
          <button
            class="category-btn bg-gray-200 text-gray-800 px-4 py-2 rounded-full"
            data-category="sets"
          >
            Сеты
          </button>
          <button
            class="category-btn bg-gray-200 text-gray-800 px-4 py-2 rounded-full"
            data-category="vegan"
          >
            Вегетарианское
          </button>
        </div>
        <div
          id="products"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        ></div>
      </section>

      <!-- Cart Modal -->
      <div
        id="cartModal"
        class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-20"
      >
        <div class="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 class="text-2xl font-bold mb-4">Корзина</h2>
          <div id="cartItems"></div>
          <div class="mt-4">
            <p class="text-gray-600">
              До бесплатной доставки:
              <span id="freeDeliveryProgress">1000 ₽</span>
            </p>
            <div class="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                id="progressBar"
                class="bg-red-500 h-4 rounded-full"
                style="width: 0%"
              ></div>
            </div>
          </div>
          <p class="mt-4 text-lg font-semibold">
            Итого: <span id="cartTotal">0 ₽</span>
          </p>
          <button id="closeModalBtn" class="mt-4 text-red-600">Закрыть</button>
        </div>
      </div>
    </main>

    <script src="/js/app.js"></script>
    <script src="/js/telegram.js"></script>
  </body>
</html>
```

### client/src/css/styles.css

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.category-btn.active {
  background-color: #EF4444;
  color: white;
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@keyframes pulse {
  0%, transform: scale(1 100%); {
  50%, transform: scale(1.05) }
  100% { transform: scale(1) }
}

.pulse {
  animation: pulse 2s infinite;
}
```

### client/src/js/app.js

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: 'Калифорния', category: 'rolls', price: 350, image: 'https://placehold.it/300x200' },
    { id: 2, name: 'Сет Фиеста', price: 1200, category: 'sets', image: 'https://placehold.it/300x200' },
    { id: 3, name: 'Веган Ролл', price: 250, category: 'vegan', image: 'https://placehold.it/300x200' },
  ];

  let cart = [];

  const productsList = document.querySelector('#products');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const cartBtn = document.querySelector('#cartBtn');
  const cartCount = document.querySelector('#cartCount');
  const cartModal = document.querySelector('#cartModal');
  const cartItems = document.querySelector('#cartItems');
  const freeDeliveryProgress = document.querySelector('#freeDeliveryProgress');
  const progressBar = document.querySelector('#progressBar');
  const cartTotal = document.querySelector('#cartTotal');
  const closeModalBtn = document.querySelector('#closeModalBtn');

  function renderProducts(category = 'all') {
    productsList.innerHTML = '';
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card bg-white rounded-lg p-4 shadow-md';
      productCard.innerHTML = = '
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg mb-2">
        <h3 class="text-lg font-semibold">${product.name}</h3>
        <p class="text-gray-600">${product.price} ₽</p>
        <button class="add-to-cart bg-red-500 text-white px-4 py-2 rounded-full mt-2 hover:bg-red-600 transition" data-id="${product.id}">В корзину</button>
      ';
      productsList.appendChild(productCard.appendChild(productCard);
    });
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.id);
        const product = products.find(p => p.id === productId);
        cart.push(product);
        updateCart();
      });
    });
  }

  function updateCart() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'flex justify-between py-2 border-b';
      cartItem.innerHTML = `
        <span>${item.name}</span>
        <span>${item.price} ₽</span>
      `;
      cartItems.appendChild(cartItem);
      total += item.price;
    });
    cartTotal.textContent = `${total} ₽`;
    const freeDeliveryThreshold = 1000;
    const progress = Math.min((total / freeDeliveryThreshold) * 100, 100);
    progressBar.style.width = `${progress}%`;
    freeDeliveryProgress.textContent = total >= freeDeliveryThreshold ? 'Бесплатная доставка!' : `${1000 - total} ₽`;
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active', 'bg-red-500', 'text-white'));
      btn.classList.add('active', 'bg-red-500', 'text-white');
      renderProducts(btn.dataset.category);
    });
  });

  cartBtn.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
  });

  closeModalBtn.addEventListener('click', () => {
    cartModal.classList.add('hidden');
  });

  renderProducts();
});
```

### client/src/js/telegram.js

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const Telegram = window.Telegram.WebApp;
  Telegram.ready();

  Telegram.MainButton.text = "Оформить заказ";
  Telegram.MainButton.color = "#EF4444";
  Telegram.MainButton.show();

  Telegram.MainButton.onClick(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      Telegram.showAlert("Корзина пуста!");
      return;
    }

    const orderDetails = cart
      .map((item) => `${item.name} - ${item.price} ₽`)
      .join("\n");
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: Telegram.initDataUnsafe.user,
        order: orderDetails,
        total,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Telegram.showAlert("Заказ успешно отправлен!");
        localStorage.removeItem("cart");
        Telegram.MainButton.hide();
      })
      .catch((error) => {
        Telegram.showAlert("Ошибка при отправке заказа.");
        console.error(error);
      });
  });
});
```

### client/public/sw.js

```javascript
const CACHE_NAME = "hiro-express-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/app.js",
  "/js/telegram.js",
  "/images/logo.png",
  "/images/sushi-hero.jpg",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match("/offline.html"))
      );
    })
  );
});
```

### client/public/manifest.json

```json
{
  "name": "Hiro Express",
  "short_name": "Hiro",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#EF4444",
  "icons": [
    {
      "src": "/images/logo.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```
