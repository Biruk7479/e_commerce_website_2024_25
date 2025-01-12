var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_BASE_URL = "http://localhost:8000";
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}
function fetchCartProducts(cart) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = cart.map((item) => fetch(`${API_BASE_URL}/products/${item._id}`).then((res) => res.json()));
        return Promise.all(promises);
    });
}
// Function to fetch JWT token from localStorage
function getAuthToken() {
    return localStorage.getItem("authToken");
}
function showSpinner() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner)
        spinner.style.display = "flex";
}
function hideSpinner() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner)
        spinner.style.display = "none";
}
export function loadComponent(url, placeholderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${url}`);
            }
            const content = yield response.text();
            document.getElementById(placeholderId).innerHTML = content;
        }
        catch (error) {
            console.error(error);
        }
    });
}
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    yield loadComponent("../components/header.html", "header-placeholder");
    yield loadComponent("../components/footer.html", "footer-placeholder");
}));
function displayCheckoutSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        const cart = getCart();
        const summaryContainer = document.getElementById("checkout-summary");
        const form = document.getElementById("checkout-form");
        if (!summaryContainer) {
            console.error("Checkout summary container not found.");
            return;
        }
        if (cart.length === 0) {
            form.style.display = "none";
            summaryContainer.innerHTML = `
      <div class="text-center">
        <p>Your cart is empty. Go back to products and add some items.</p>
      </div>`;
            return;
        }
        form.style.display = "block";
        showSpinner();
        try {
            const products = yield fetchCartProducts(cart);
            let total = 0;
            summaryContainer.innerHTML = `
      <h4>Order Summary</h4>
      <ul class="list-group mb-4">
        ${products
                .map((product, index) => {
                const item = cart[index];
                const subtotal = item.quantity * product.price;
                total += subtotal;
                return `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${product.title} (x${item.quantity})</span>
                <span>$${subtotal.toFixed(2)}</span>
              </li>`;
            })
                .join("")}
        <li class="list-group-item d-flex justify-content-between align-items-center fw-bold">
          <span>Total</span>
          <span>$${total.toFixed(2)}</span>
        </li>
      </ul>`;
        }
        catch (error) {
            console.error("Error fetching cart products:", error);
            summaryContainer.innerHTML = `
      <div class="alert alert-danger">
        Failed to load the order summary. Please try again later.
      </div>`;
        }
        finally {
            hideSpinner();
        }
    });
}
function handleCheckoutFormSubmission() {
    const form = document.getElementById("checkout-form");
    if (!form) {
        console.error("Checkout form not found.");
        return;
    }
    form.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        if (!name || !email || !address) {
            alert("Please fill in all required fields.");
            return;
        }
        const cart = getCart();
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items to the cart.");
            return;
        }
        showSpinner();
        // Get the JWT token
        const token = getAuthToken();
        if (!token) {
            alert("You must be logged in to place an order.");
            hideSpinner();
            return;
        }
        try {
            const response = yield fetch("http://localhost:8000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Add JWT token to the header
                },
                body: JSON.stringify({
                    customerName: name,
                    customerEmail: email,
                    address,
                    userId: localStorage.getItem("userId"), // Assuming userId is stored in localStorage
                    products: cart.map((item) => ({
                        productId: item._id, // Assuming item._id is the product ID
                        quantity: item.quantity,
                    })),
                }),
            });
            if (response.ok) {
                const data = yield response.json();
                alert(`Thank you for your order, ${name}! Your order has been placed.`);
                localStorage.removeItem("cart");
                window.location.href = "./orders.html";
            }
            else {
                const errorData = yield response.json();
                console.error("Error placing order:", errorData);
                alert("Failed to place the order. Please try again.");
            }
        }
        catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
        finally {
            hideSpinner();
        }
    }));
}
document.addEventListener("DOMContentLoaded", () => {
    displayCheckoutSummary();
    handleCheckoutFormSubmission();
});
