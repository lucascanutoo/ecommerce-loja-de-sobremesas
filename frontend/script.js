let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  const cartTitle = document.querySelector("aside h2");

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    totalElement.textContent = "";
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
        <button onclick="removeItem(${index})">✖</button>
      `;
      cartContainer.appendChild(itemBox);
    });
    totalElement.textContent = "Total: $" + total.toFixed(2);
  }

  cartTitle.textContent = `Seu carrinho (${cart.length})`;
  localStorage.setItem('cart', JSON.stringify(cart));
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function finalizarCompra() {
  if (cart.length === 0) return showAlert("Seu carrinho está vazio!");
  showAlert("Compra finalizada com sucesso!");
  cart = [];
  updateCart();
}

document.querySelectorAll('.product button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product');
    const name = card.querySelector('h4').textContent;
    const price = parseFloat(card.querySelectorAll('p')[1].textContent.replace('$', ''));
    const image = card.querySelector('img').src;

    cart.push({ name, price, image });
    updateCart();

    button.textContent = "✅ Adicionado!";
    setTimeout(() => button.textContent = "🛒 Adicionar ao carrinho", 1000);
  });
});

updateCart();

function showAlert(message) {
  const alertBox = document.getElementById("alert-box");
  const alertText = document.getElementById("alert-message");
  alertText.textContent = message;
  alertBox.classList.remove("hidden");

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 3000); // esconde após 3s
}