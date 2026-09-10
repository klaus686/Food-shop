/* =========================================================
   CONFIG — edit these to match your shop
   ========================================================= */
const SHOP_NAME = "The Green Spoon";
const WHATSAPP_NUMBER = "10000000000"; // country code + number, digits only, no + or spaces

const MENU = [
  {
    category: "Starters",
    items: [
      { id: "s1", name: "Garlic Flatbread", price: 4.50, desc: "Warm flatbread, roasted garlic butter, herbs." },
      { id: "s2", name: "Soup of the Day", price: 5.00, desc: "Ask us what's simmering today." },
    ],
  },
  {
    category: "Mains",
    items: [
      { id: "m1", name: "Herb Roast Chicken", price: 13.00, desc: "Half chicken, seasonal vegetables, pan jus." },
      { id: "m2", name: "Paneer Tikka Bowl", price: 11.50, desc: "Char-grilled paneer, spiced rice, mint chutney." },
      { id: "m3", name: "Market Veg Curry", price: 10.00, desc: "Whatever's freshest this week, coconut base." },
    ],
  },
  {
    category: "Drinks",
    items: [
      { id: "d1", name: "Fresh Lime Soda", price: 2.50, desc: "Sweet, salty, or mixed." },
      { id: "d2", name: "Masala Chai", price: 2.00, desc: "Brewed fresh, served hot." },
    ],
  },
];

/* =========================================================
   State
   ========================================================= */
const cart = {}; // id -> { item, qty }

const formatPrice = (n) => `$${n.toFixed(2)}`;

function findItem(id) {
  for (const cat of MENU) {
    const found = cat.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}

/* =========================================================
   Rendering: category nav + menu
   ========================================================= */
function renderNav() {
  const nav = document.getElementById("categoryNav");
  nav.innerHTML = "";
  MENU.forEach((cat, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = cat.category;
    btn.setAttribute("aria-current", idx === 0 ? "true" : "false");
    btn.addEventListener("click", () => {
      document.getElementById(`cat-${cat.category}`).scrollIntoView({ behavior: "smooth", block: "start" });
    });
    nav.appendChild(btn);
  });
}

function renderMenu() {
  const menuEl = document.getElementById("menu");
  menuEl.innerHTML = "";

  MENU.forEach((cat) => {
    const block = document.createElement("section");
    block.className = "category-block";
    block.id = `cat-${cat.category}`;

    const title = document.createElement("h2");
    title.className = "category-title";
    title.textContent = cat.category;
    block.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "dish-grid";

    cat.items.forEach((item) => {
      grid.appendChild(renderDishCard(item));
    });

    block.appendChild(grid);
    menuEl.appendChild(block);
  });
}

function renderDishCard(item) {
  const card = document.createElement("article");
  card.className = "dish-card";
  card.innerHTML = `
    <div class="dish-head">
      <h3 class="dish-name">${item.name}</h3>
      <span class="dish-price">${formatPrice(item.price)}</span>
    </div>
    <p class="dish-desc">${item.desc}</p>
    <div class="dish-actions" data-actions-for="${item.id}"></div>
  `;
  renderDishActions(card.querySelector(`[data-actions-for="${item.id}"]`), item);
  return card;
}

function renderDishActions(container, item) {
  const qty = cart[item.id]?.qty || 0;

  if (qty === 0) {
    container.innerHTML = `<span></span><button type="button" class="add-button">Add</button>`;
    container.querySelector(".add-button").addEventListener("click", () => changeQty(item.id, 1));
  } else {
    container.innerHTML = `
      <div class="qty-control">
        <button type="button" data-action="dec" aria-label="Remove one ${item.name}">−</button>
        <span>${qty}</span>
        <button type="button" data-action="inc" aria-label="Add one more ${item.name}">+</button>
      </div>
      <span></span>
    `;
    container.querySelector('[data-action="dec"]').addEventListener("click", () => changeQty(item.id, -1));
    container.querySelector('[data-action="inc"]').addEventListener("click", () => changeQty(item.id, 1));
  }
}

function changeQty(id, delta) {
  const item = findItem(id);
  if (!item) return;

  const current = cart[id]?.qty || 0;
  const next = Math.max(0, current + delta);

  if (next === 0) {
    delete cart[id];
  } else {
    cart[id] = { item, qty: next };
  }

  // Re-render just this dish's action area
  const container = document.querySelector(`[data-actions-for="${id}"]`);
  if (container) renderDishActions(container, item);

  updateCartUI();
}

/* =========================================================
   Cart totals + drawer
   ========================================================= */
function cartEntries() {
  return Object.values(cart);
}

function cartTotal() {
  return cartEntries().reduce((sum, { item, qty }) => sum + item.price * qty, 0);
}

function cartItemCount() {
  return cartEntries().reduce((sum, { qty }) => sum + qty, 0);
}

function updateCartUI() {
  const count = cartItemCount();
  const total = cartTotal();

  document.getElementById("cartCount").textContent = `${count} item${count === 1 ? "" : "s"}`;
  document.getElementById("cartTotal").textContent = formatPrice(total);
  document.getElementById("cartDrawerTotal").textContent = formatPrice(total);

  document.getElementById("cartBar").classList.toggle("visible", count > 0);

  renderCartDrawerItems();
  updateWhatsAppLink();
}

function renderCartDrawerItems() {
  const list = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  list.innerHTML = "";

  const entries = cartEntries();
  empty.style.display = entries.length === 0 ? "block" : "none";

  entries.forEach(({ item, qty }) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${qty} × ${item.name}</span><span>${formatPrice(item.price * qty)}</span>`;
    list.appendChild(li);
  });
}

function updateWhatsAppLink() {
  const link = document.getElementById("whatsappButton");
  const entries = cartEntries();

  if (entries.length === 0) {
    link.setAttribute("aria-disabled", "true");
    link.removeAttribute("href");
    return;
  }

  const lines = entries.map(({ item, qty }) => `${qty} × ${item.name} — ${formatPrice(item.price * qty)}`);
  const message = [
    `Order for ${SHOP_NAME}:`,
    ...lines,
    `Total: ${formatPrice(cartTotal())}`,
  ].join("\n");

  link.removeAttribute("aria-disabled");
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* =========================================================
   Drawer open/close
   ========================================================= */
function openDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
}

/* =========================================================
   Init
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderMenu();
  updateCartUI();

  document.getElementById("cartToggle").addEventListener("click", openDrawer);
  document.getElementById("cartClose").addEventListener("click", closeDrawer);
  document.getElementById("cartDrawer").addEventListener("click", (e) => {
    if (e.target.id === "cartDrawer") closeDrawer();
  });
});
