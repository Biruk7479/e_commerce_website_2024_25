// import { fetchCartProducts } from "../assets/fetch-api/api.js";

const API_BASE_URL = "http://localhost:8000";
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector(".cart-badge");
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  } else {
    console.log("there is no cart badge");
  }
}

export async function fetchCartProducts(cart) {
  const promises = cart.map((item) =>
    fetch(`${API_BASE_URL}/products/${item._id}`).then((res) => res.json())
  );
  return Promise.all(promises);
}

function showSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "flex";
}
async function loadComponent(url, placeholderId) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${url}`);
    }
    const content = await response.text();
    document.getElementById(placeholderId).innerHTML = content;
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("../components/header.html", "header-placeholder");
  await loadComponent("../components/footer.html", "footer-placeholder");
  // Initialize the cart badge on page load
});
function hideSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "none";
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Display cart items and the total.
 */
async function displayCart() {
  const cart = getCart();
  const cartItemsContainer: any = document.getElementById("cart-items");
  const cartTotalElement: any = document.getElementById("cart-total");
  const checkoutButton: any = document.getElementById("checkout-btn");

  if (!cartItemsContainer || !cartTotalElement || !checkoutButton) {
    console.error("Cart elements not found.");
    return;
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center">
        <p>Your cart is empty. Start adding some amazing products!</p>
      </div>`;
    cartTotalElement.textContent = "";
    checkoutButton.disabled = true;
    return;
  }

  showSpinner();
  const products = await fetchCartProducts(cart);
  hideSpinner();

  let total = 0;

  cartItemsContainer.innerHTML = products
    .map((product, index) => {
      const item = cart[index];
      const subtotal = item.quantity * product.price;
      total += subtotal;

      return `
        <div class="col-md-12">
          <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
            <div class="d-flex align-items-center">
              <img src="../../Backend${product.image}" alt="${
        product.title
      }" style="width: 100px; height: auto; object-fit: contain;">
              <div class="ms-3">
                <h5>${product.title}</h5>
                <p class="text-success">$${
                  product.price && !isNaN(product.price)
                    ? product.price.toFixed(2)
                    : "N/A"
                }</p>
              </div>
            </div>
            <div>
              <input type="number" min="1" value="${
                item.quantity
              }" class="form-control cart-quantity" data-product-id="${
        item._id
      }">
            </div>
            <p class="fw-bold">$${
              !isNaN(subtotal) ? subtotal.toFixed(2) : "N/A"
            }</p>
            <button class="btn btn-danger btn-sm remove-cart-item" data-product-id="${
              item._id
            }">Remove</button>
          </div>
        </div>`;
    })
    .join("");

  cartTotalElement.textContent = `Total: $${
    !isNaN(total) ? total.toFixed(2) : "N/A"
  }`;
  checkoutButton.disabled = false;

  if (!checkoutButton.disabled) {
    checkoutButton.addEventListener("click", function () {
      window.location.href = "checkout.html";
    });
  }

  document.querySelectorAll(".cart-quantity").forEach((input) => {
    input.addEventListener("change", (e: any) => {
      const productId = parseInt(e.target?.getAttribute("data-product-id"), 10);
      const newQuantity = parseInt(e.target?.value, 10);
      updateCartQuantity(productId, newQuantity);
      displayCart();
    });
  });

  document.querySelectorAll(".remove-cart-item").forEach((button) => {
    button.addEventListener("click", (e: any) => {
      const productId = e.target.getAttribute("data-product-id"); // No need to parse it as a number
      removeFromCart(productId); // Ensure productId is passed as a string if it's a string type
      displayCart();
    });
  });
}

/**
 * Update the quantity of an item in the cart.
 * @param {number} productId - The ID of the product.
 * @param {number} quantity - The new quantity.
 */
function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item._id === productId);
  if (item) {
    item.quantity = quantity > 0 ? quantity : 1;
    saveCart(cart);
    updateCartBadge();
  }
}

/**
 * Remove an item from the cart.
 * @param {number} productId - The ID of the product to remove.
 */
function removeFromCart(productId) {
  // Remove the item by checking if the _id matches directly without parsing to integer
  const cart = getCart().filter((item) => item._id !== productId); // _id should match the type in your cart
  saveCart(cart);
  updateCartBadge();
}

// Initialize the cart
document.addEventListener("DOMContentLoaded", () => {
  displayCart();
});
