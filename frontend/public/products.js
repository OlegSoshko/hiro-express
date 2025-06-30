async function fetchData() {
  const res = await fetch('data.json');

  if (!res.ok) {
    throw new Error('Ошибка загрузки data.json');
  }

  return await res.json();
}

function renderCategories(categories) {
  const nav = document.getElementById('category-tabs');
  nav.innerHTML = '';
  
  const allBtn = document.createElement('button');
  allBtn.textContent = 'Все';
  allBtn.className = 'whitespace-nowrap px-4 py-2 text-base font-medium text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-500 focus:outline-none active border-red-500 text-red-600';
  allBtn.dataset.category = '';
  allBtn.addEventListener('click', () => {
    document.querySelectorAll('#category-tabs button').forEach(b => b.classList.remove('active', 'border-red-500', 'text-red-600'));
    allBtn.classList.add('active', 'border-red-500', 'text-red-600');
    renderProducts(window.allProducts, null);
  });

  nav.appendChild(allBtn);
  
  categories.forEach((cat, idx) => {
    const btn = document.createElement('button');
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.className = 'whitespace-nowrap px-4 py-2 text-base font-medium text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-500 focus:outline-none';
    btn.dataset.category = cat;
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#category-tabs button').forEach(b => b.classList.remove('active', 'border-red-500', 'text-red-600'));
      btn.classList.add('active', 'border-red-500', 'text-red-600');
      renderProducts(window.allProducts, cat);
    });

    nav.appendChild(btn);
  });
  
  document.querySelector('#category-tabs button').classList.add('active', 'border-red-500', 'text-red-600');
}

function renderProducts(products, category) {
  const grid = document.getElementById('menu-grid');
  grid.innerHTML = '';

  const filtered = category ? products.filter(p => p.categories.includes(category)) : products;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center text-gray-400">Нет товаров в этой категории</div>';

    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative border-t border-gray-200';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.className = 'h-40 w-full object-contain';
    img.onerror = function() {
      this.src = 'images/placeholder.webp';
      this.style.opacity = '0.2';
    };

    card.appendChild(img);

    if (product.tags && product.tags.length > 0) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'absolute top-2 right-2 flex flex-col items-end space-y-1 z-10';

      product.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = `px-2 py-0.5 rounded-full text-xs font-medium ${tag === 'хит' ? 'bg-red-100 text-red-600' : tag === 'акция' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`;
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
      });

      card.appendChild(tagsDiv);
    }

    const content = document.createElement('div');
    content.className = 'p-4 flex-1 flex flex-col';
    content.innerHTML = `
      <h3 class="text-lg font-semibold mb-1">${product.name}</h3>
      <div class="text-sm text-gray-500 mb-2">${product.ingredients}</div>
      <div class="mt-auto flex items-end justify-between">
        <div>
          ${product.oldPrice ? `<span class="text-gray-400 line-through mr-2">${product.oldPrice}₽</span>` : ''}
          <span class="text-xl font-bold text-red-600">${product.price}₽</span>
        </div>
        <button class="ml-2 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm flex items-center">
          <i data-lucide="shopping-cart" class="w-4 h-4 mr-2"></i>
          В корзину
        </button>
      </div>
    `;

    card.appendChild(content);
    grid.appendChild(card);
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

async function initMenu() {
  try {
    const data = await fetchData();

    window.allProducts = data.products;
    
    renderCategories(data.categories);
    renderProducts(data.products, data.categories[0]);
  } catch (e) {
    document.getElementById('menu-grid').innerHTML = '<div class="col-span-full text-center text-red-500">Ошибка загрузки меню</div>';
  }
}

document.addEventListener('DOMContentLoaded', initMenu);
