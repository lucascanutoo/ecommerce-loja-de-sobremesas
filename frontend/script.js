let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  const cartTitle = document.querySelector("aside h2");
  const checkoutBtn = document.getElementById("checkoutBtn");

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    totalElement.textContent = "";
    checkoutBtn.style.display = "none";
  } else {
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price;
      const itemBox = document.createElement("div");
      itemBox.classList.add("cart-item");
      itemBox.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <strong>${item.name}</strong><br>
          <span>$${item.price.toFixed(2)}</span>
        </div>
        <button aria-label="Remover item do carrinho" onclick="removeItem(${index})" title="Remover item">🗑️</button>
      `;
      cartContainer.appendChild(itemBox);
    });
    totalElement.textContent = "Total: $" + total.toFixed(2);
    checkoutBtn.style.display = "block";
  }

  cartTitle.textContent = `Seu carrinho (${cart.length})`;
  localStorage.setItem('cart', JSON.stringify(cart));
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
  showAlert("Item removido do carrinho!");
}

function finalizarCompra() {
  if (cart.length === 0) return showAlert("Seu carrinho está vazio!");
  showAlert("Compra finalizada com sucesso!");
  cart = [];
  updateCart();
}

// Adiciona produto ao carrinho
document.querySelectorAll('.product button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product');
    const name = card.querySelector('h4').textContent;
    const price = parseFloat(card.querySelectorAll('p')[1].textContent.replace('$', ''));
    const image = card.querySelector('img').src;

    cart.push({ name, price, image });
    updateCart();

    button.textContent = "✅ Adicionado!";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = "🛒 Adicionar ao carrinho";
      button.disabled = false;
    }, 1000);

    showAlert("Produto adicionado ao carrinho!");
  });
});

updateCart();

// Alerta bonito
function showAlert(message) {
  const alertBox = document.getElementById("alert-box");
  const alertText = document.getElementById("alert-message");
  alertText.textContent = message;
  alertBox.classList.remove("hidden");

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 2800); // Esconde após 2.8s
}