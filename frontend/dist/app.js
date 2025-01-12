var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import updateCartBadge from "./updateCartBadge";
// import { getCart } from "./updateCartBadge";
// const API_BASE_URL = "https://fakestoreapi.com";
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
    }
    else {
        console.log("there is no cart badge");
    }
}
function loadComponent(url, placeholderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            const htmlContent = yield response.text();
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = htmlContent;
            }
        }
        catch (error) {
            console.error(`Error loading component: ${error.message}`);
        }
    });
}
export function fetchCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/products/categories`);
            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.statusText}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    });
}
export function fetchProducts() {
    return __awaiter(this, arguments, void 0, function* (category = null) {
        const endpoint = category
            ? `${API_BASE_URL}/products/category/${category}`
            : `${API_BASE_URL}/products`;
        try {
            const response = yield fetch(endpoint);
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    });
}
export function fetchProductById(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/products/${productId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.statusText}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }
    });
}
function fetchCartProducts(cart) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = cart.map((item) => fetch(`${API_BASE_URL}/products/${item._id}`).then((res) => res.json()));
        return Promise.all(promises);
    });
}
function showSpinner() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner)
        spinner.style.display = "flex";
}
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
function hideSpinner() {
    const spinner = document.getElementById("loading-spinner");
    if (spinner)
        spinner.style.display = "none";
}
// Load header and footer, and initialize other functionality once the DOM is ready
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    // Load the header and footer
    yield loadComponent("../components/header.html", "header-placeholder");
    yield loadComponent("../components/footer.html", "footer-placeholder");
    // Initialize the cart badge
    updateCartBadge();
    // Now that the header is loaded, check login status and set up buttons
    checkAuthStatus();
    showSpinner();
    yield displayCategories(); // Fetch and display categories
    yield displayProducts(); // Fetch and display all products initially
    hideSpinner();
}));
/**
 * Check authentication status and toggle Login/Logout buttons
 */
function checkAuthStatus() {
    const token = localStorage.getItem("authToken");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    if (token) {
        // If user is logged in, hide login button and show logout button
        loginBtn.classList.add("d-none");
        logoutBtn.classList.remove("d-none");
        logoutBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            yield logoutUser(token);
        }));
    }
    else {
        // If user is not logged in, show login button and hide logout button
        loginBtn.classList.remove("d-none");
        logoutBtn.classList.add("d-none");
        loginBtn.addEventListener("click", () => {
            window.location.href = "../pages/login.html"; // Redirect to login page
        });
    }
}
/**
 * Handle user logout
 */
function logoutUser(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("http://localhost:8000/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Send token as authorization header
                },
            });
            const data = yield response.json();
            if (response.ok) {
                // On success, remove the token and redirect to login page
                localStorage.removeItem("authToken");
                alert(data.message); // Show logout success message
                window.location.href = "../pages/login.html"; // Redirect to login page
            }
            else {
                // Handle error (token invalid, etc.)
                alert("Logout failed: " + data.message);
            }
        }
        catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}
/**
 * Display product categories as buttons, including an "ALL" button.
 */
function displayCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const categoriesContainer = document.getElementById("categories");
        if (!categoriesContainer) {
            console.error("Categories container element not found.");
            return;
        }
        try {
            const categories = yield fetchCategories();
            // Add "ALL" button and other category buttons
            categoriesContainer.innerHTML = `
      <button class="btn btn-outline-dark mx-2 category-btn" data-category="all">ALL</button>
      ${categories
                .map((category) => ` 
          <button class="btn btn-outline-dark mx-2 category-btn" data-category="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</button>`)
                .join("")}`;
            // Add event listeners for category buttons
            document.querySelectorAll(".category-btn").forEach((button) => {
                button.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    const category = button.getAttribute("data-category");
                    showSpinner();
                    yield displayProducts(category === "all" ? null : category);
                    hideSpinner();
                }));
            });
        }
        catch (error) {
            console.error("Error displaying categories:", error);
            categoriesContainer.innerHTML = `<p class="text-danger">Failed to load categories. Please try again later.</p>`;
        }
    });
}
/**
 * Display products in the product grid or details of a single product.
 * @param {string|null} category - The category to fetch products for, or null for all products.
 */
function displayProducts() {
    return __awaiter(this, arguments, void 0, function* (category = null) {
        const productGrid = document.getElementById("product-grid");
        if (!productGrid) {
            console.error("Product grid element not found.");
            return;
        }
        try {
            const products = yield fetchProducts(category);
            productGrid.innerHTML = products
                .map((product) => `
        <div class="col-xl-4 p-3">
          <div class="card h-100 shadow-sm" style="min-height: 400px;">
            <img src="../../Backend${product.image}" class="card-img-top w-100 h-100" alt="${product.title}" style="height: 200px; object-fit: contain;">
            <div class="card-body">
              <h5 class="card-title text-truncate" title="${product.title}">${product.title}</h5>
              <p class="card-text text-dark fw-bold">$${product.price.toFixed(2)}</p>
              <button class="btn btn-outline-dark w-100 view-product-btn" data-product-id="${product._id}">View Details</button>
            </div>
          </div>
        </div>`)
                .join("");
            // Add event listeners for "View Details" buttons
            document.querySelectorAll(".view-product-btn").forEach((button) => {
                button.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    const productId = button.getAttribute("data-product-id");
                    showSpinner();
                    yield displayProductDetails(productId);
                    hideSpinner();
                }));
            });
        }
        catch (error) {
            console.error("Error displaying products:", error);
            productGrid.innerHTML = `<p class="text-danger">Failed to load products. Please try again later.</p>`;
        }
    });
}
/**
 * Display details of a single product.
 * @param {string} productId - The ID of the product to display.
 */
function displayProductDetails(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const productGrid = document.getElementById("product-grid");
        if (!productGrid) {
            console.error("Product grid element not found.");
            return;
        }
        try {
            const product = yield fetchProductById(productId);
            if (!product) {
                productGrid.innerHTML = `<p class="text-danger">Failed to load product details. Please try again later.</p>`;
                return;
            }
            productGrid.innerHTML = `
      <div class="col-12">
        <div class="card h-100 shadow-sm">
          <img src="../../Backend${product.image}" class="card-img-top mx-auto" alt="${product.title}" style="height: 300px; width: auto; object-fit: contain;">
          <div class="card-body">
            <h3 class="card-title">${product.title}</h3>
            <p class="card-text">${product.description}</p>
            <p class="card-text text-success fw-bold">$${product.price.toFixed(2)}</p>
            <p class="card-text">Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
            <button class="btn btn-primary w-100 add-to-cart-btn" data-product-id="${product._id}">Add to Cart</button>
          </div>
        </div>
        <button class="btn btn-secondary mt-2" id="back-to-products">Back to Products</button>
      </div>
    `;
            // Add event listener for the "Back to Products" button
            (_a = document
                .getElementById("back-to-products")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                showSpinner();
                yield displayProducts();
                hideSpinner();
            }));
            // Add to cart functionality
            (_b = document
                .querySelector(".add-to-cart-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
                addToCart(product._id);
            });
        }
        catch (error) {
            console.error("Error displaying product details:", error);
            productGrid.innerHTML = `<p class="text-danger">Failed to load product details. Please try again later.</p>`;
        }
    });
}
// Add to cart functionality
function addToCart(productId) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Please log in to add items to the cart.");
        window.location.href = "login.html";
        return;
    }
    const cart = getCart();
    const existingItem = cart.find((item) => item._id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    }
    else {
        cart.push({ _id: productId, quantity: 1 });
    }
    saveCart(cart);
    updateCartBadge();
    alert("Item added to cart!");
}
