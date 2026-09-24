import { products } from './data.js';
import productTemplate from './template.hbs';

// ==========================================
// 1. "Закладки" з localStorage (Додавання, видалення, редагування)
// ==========================================
const urlInput = document.getElementById('bookmarkInput');
const addBtn = document.getElementById('addBookmarkBtn');
const bookmarkList = document.getElementById('bookmarkList');

let bookmarks = JSON.parse(localStorage.getItem('saved_bookmarks')) || [];

function renderBookmarks() {
  bookmarkList.innerHTML = '';
  bookmarks.forEach((item, idx) => {
    const li = document.createElement('li');
    
    const link = document.createElement('a');
    link.href = item;
    link.target = '_blank';
    link.textContent = item;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Змінити';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => {
      const updatedUrl = prompt('Введіть новий URL:', item);
      if (updatedUrl) {
        bookmarks[idx] = updatedUrl;
        saveAndRenderBookmarks();
      }
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Видалити';
    delBtn.className = 'delete';
    delBtn.onclick = () => {
      bookmarks.splice(idx, 1);
      saveAndRenderBookmarks();
    };

    actionsDiv.append(editBtn, delBtn);
    li.append(link, actionsDiv);
    bookmarkList.appendChild(li);
  });
}

function saveAndRenderBookmarks() {
  localStorage.setItem('saved_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
}

addBtn.addEventListener('click', () => {
  const value = urlInput.value.trim();
  if (value) {
    bookmarks.push(value);
    urlInput.value = '';
    saveAndRenderBookmarks();
  }
});

renderBookmarks();

// ==========================================
// 2. Форма збереження даних
// ==========================================
const userField = document.getElementById('username');
const passField = document.getElementById('password');
const saveFormBtn = document.getElementById('saveBtn');

const savedFormData = JSON.parse(localStorage.getItem('user_credentials'));
if (savedFormData) {
  userField.value = savedFormData.username || '';
  passField.value = savedFormData.password || '';
}

saveFormBtn.addEventListener('click', () => {
  const credentials = {
    username: userField.value,
    password: passField.value
  };
  localStorage.setItem('user_credentials', JSON.stringify(credentials));
  alert('Дані збережено в localStorage!');
});

// ==========================================
// 8-10. Handlebars Шаблон та Пошук продуктів
// ==========================================
const productContainer = document.getElementById('productListContainer');
const searchBox = document.getElementById('searchInput');

function renderProductList(items) {
  productContainer.innerHTML = productTemplate(items);
}

searchBox.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.description.toLowerCase().includes(query)
  );
  renderProductList(filteredProducts);
});

// Початковий рендер усіх продуктів
renderProductList(products);