// ===============================
// UTILIDADES
// ===============================

// Atualizar ano do rodapé
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Carregar carrinho do LocalStorage
function loadCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// Salvar carrinho
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Atualizar número do carrinho no header
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const cart = loadCart();
  el.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}
updateCartCount();

// ===============================
// ADICIONAR AO CARRINHO
// ===============================

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-cart")) {
    const card = e.target.closest(".product-card");
    const id = card.dataset.id;
    const title = card.querySelector("h3").textContent;
    const price = parseFloat(
      card.querySelector(".price").textContent.replace("R$", "").replace(",", ".")
    );
    const img = card.querySelector("img").src;

    let cart = loadCart();
    const existing = cart.find((p) => p.id === id);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, title, price, img, qty: 1 });
    }

    saveCart(cart);
    alert("Produto adicionado ao carrinho!");
  }
});

// ===============================
// PÁGINA: CARRINHO
// ===============================

function renderCartPage() {
  const container = document.getElementById("cart-items");
  if (!container) return; // Só executa se estiver na página de carrinho

  const cart = loadCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    document.getElementById("cart-total").textContent = "0,00";
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.img}">
      <div>
        <h3>${item.title}</h3>
        <p>R$ ${item.price.toFixed(2)}</p>
        <p>Quantidade: ${item.qty}</p>
      </div>
    `;
    container.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("cart-total").textContent = total.toFixed(2);
}
renderCartPage();

// ===============================
// NEWSLETTER
// ===============================

const newsForm = document.getElementById("newsletter-form");
if (newsForm) {
  newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value;
    alert("Obrigado! Promoções serão enviadas para: " + email);
    newsForm.reset();
  });
}

// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("form-login");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Login realizado com sucesso!");
    window.location.href = "index.html";
  });
}

// ===============================
// CADASTRO
// ===============================

const cadastroForm = document.getElementById("form-cadastro");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  });
}

// ===============================
// CONFIRMAR COMPRA
// ===============================

const btnConfirmar = document.getElementById("confirmar-compra");
if (btnConfirmar) {
  btnConfirmar.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}

// ===============================
// CHECKOUT
// ===============================

const formCheckout = document.getElementById("form-checkout");
if (formCheckout) {
  formCheckout.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "pagamento.html";
  });
}

// ===============================
// PAGAMENTO
// ===============================

const formPagamento = document.getElementById("form-pagamento");
if (formPagamento) {
  formPagamento.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Pagamento aprovado!");
    localStorage.removeItem("cart");
    window.location.href = "feedback.html";
  });
}

// ===============================
// FEEDBACK
// ===============================

const formFeedback = document.getElementById("form-feedback");
if (formFeedback) {
  formFeedback.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Obrigado pelo seu feedback!");
    window.location.href = "index.html";
  });
}
