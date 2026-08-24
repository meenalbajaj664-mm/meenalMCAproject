// script.js - simple cart logic for MEE SHOP+
const products = [
  { id: 1, title: 'Classic Tee', price: 19.99, img: 'https://via.placeholder.com/400x300?text=Classic+Tee' },
  { id: 2, title: 'Sneaker X', price: 59.99, img: 'https://via.placeholder.com/400x300?text=Sneaker+X' },
  { id: 3, title: 'Denim Jacket', price: 79.99, img: 'https://via.placeholder.com/400x300?text=Denim+Jacket' },
  { id: 4, title: 'Cap', price: 12.99, img: 'https://via.placeholder.com/400x300?text=Cap' },
  { id: 5, title: 'Backpack', price: 45.00, img: 'https://via.placeholder.com/400x300?text=Backpack' }
];

const productsEl = document.getElementById('products');
const cartBtn = document.getElementById('cart-button');
const cartCountEl = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');

let cart = JSON.parse(localStorage.getItem('mee_cart') || '[]');

function renderProducts(){
  productsEl.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <p>High-quality product</p>
      <div class="price">$${p.price.toFixed(2)}</div>
      <div style="margin-top:0.6rem">
        <button class="btn primary" data-id="${p.id}">Add to cart</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
}

function updateCartCount(){
  const count = cart.reduce((s,i)=>s+i.quantity,0);
  cartCountEl.textContent = count;
}

function saveCart(){
  localStorage.setItem('mee_cart', JSON.stringify(cart));
}

function addToCart(id){
  const prod = products.find(p=>p.id===id);
  if(!prod) return;
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.quantity++;
  else cart.push({ id: prod.id, title: prod.title, price: prod.price, img: prod.img, quantity: 1 });
  saveCart();
  updateCartCount();
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart();
  renderCart();
  updateCartCount();
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  let total = 0;
  if(cart.length===0){
    cartItemsEl.innerHTML = '<li>Your cart is empty.</li>';
  } else {
    cart.forEach(item => {
      total += item.price * item.quantity;
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div style="flex:1">
          <div style="font-weight:600">${item.title}</div>
          <div style="color:#6b7280">$${item.price.toFixed(2)} × ${item.quantity}</div>
        </div>
        <div>
          <button class="btn ghost" data-remove="${item.id}">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(li);
    });
  }
  cartTotalEl.textContent = total.toFixed(2);
}

// Event bindings
productsEl.addEventListener('click', e=>{
  const btn = e.target.closest('button[data-id]');
  if(!btn) return;
  const id = Number(btn.getAttribute('data-id'));
  addToCart(id);
});

cartBtn.addEventListener('click', ()=>{
  cartModal.setAttribute('aria-hidden','false');
  renderCart();
});

closeCart.addEventListener('click', ()=>{
  cartModal.setAttribute('aria-hidden','true');
});

cartItemsEl.addEventListener('click', e=>{
  const rem = e.target.closest('button[data-remove]');
  if(!rem) return;
  const id = Number(rem.getAttribute('data-remove'));
  removeFromCart(id);
});

checkoutBtn.addEventListener('click', ()=>{
  if(cart.length===0) return alert('Cart is empty');
  // Very simple checkout simulation
  alert('Thank you for your purchase!');
  cart = [];
  saveCart();
  renderCart();
  updateCartCount();
  cartModal.setAttribute('aria-hidden','true');
});

// Init
renderProducts();
updateCartCount();
document.getElementById('year').textContent = new Date().getFullYear();
