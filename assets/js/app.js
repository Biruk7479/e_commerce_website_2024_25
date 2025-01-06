"use strict";
function showSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "flex";
}

function hideSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "none";
}

async function loadComponent(url, placeholderId) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    const htmlContent = await response.text();
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.innerHTML = htmlContent;
    }
  } catch (error) {
    console.error(`Error loading component: ${error.message}`);
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("./components/header.html", "header-placeholder");
  await loadComponent("./components/footer.html", "footer-placeholder");
  // Initialize the cart badge on page load
  updateCartBadge();
});

// show products
// Base URL for Fake Store API
const API_BASE_URL = "https://fakestoreapi.com";

/**
 * Fetch all product categories from the API.
 * @returns {Promise<Array>} A promise that resolves with an array of categories.
 */
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch products by category or all products if no category is specified.
 * @param {string|null} category - The category to fetch products for, or null for all products.
 * @returns {Promise<Array>} A promise that resolves with an array of products.
 */
async function fetchProducts(category = null) {
  const endpoint = category
    ? `${API_BASE_URL}/products/category/${category}`
    : `${API_BASE_URL}/products`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetch a single product by its ID.
 * @param {number} productId - The ID of the product to fetch.
 * @returns {Promise<Object>} A promise that resolves with the product details.
 */
async function fetchProductById(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Display product categories as buttons, including an "ALL" button.
 */
async function displayCategories() {
  const categoriesContainer = document.getElementById("categories");

  if (!categoriesContainer) {
    console.error("Categories container element not found.");
    return;
  }

  try {
    const categories = await fetchCategories();

    // Add "ALL" button and other category buttons
    categoriesContainer.innerHTML = `
      <button class="btn btn-outline-primary mx-2 category-btn" data-category="all">ALL</button>
      ${categories
        .map(
          (category) => `
          <button class="btn btn-outline-primary mx-2 category-btn" data-category="${category}">
            ${category.charAt(0).toUpperCase() + category.slice(1)}
          </button>`
        )
        .join("")}`;

    // Add event listeners for category buttons
    document.querySelectorAll(".category-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");
        displayProducts(category === "all" ? null : category);
      });
    });
  } catch (error) {
    console.error("Error displaying categories:", error);
    categoriesContainer.innerHTML = `<p class="text-danger">Failed to load categories. Please try again later.</p>`;
  }
}

/**
 * Display products in the product grid or details of a single product.
 * @param {string|null} category - The category to fetch products for, or null for all products.
 */
async function displayProducts(category = null) {
  const productGrid = document.getElementById("product-grid");

  if (!productGrid) {
    console.error("Product grid element not found.");
    return;
  }

  try {
    const products = await fetchProducts(category);

    productGrid.innerHTML = products
      .map(
        (product) => `
        <div class="col-md-3">
          <div class="card h-100 shadow-sm">
            <img src="${product.image}" class="card-img-top" alt="${
          product.title
        }" style="height: 200px; object-fit: contain;">
            <div class="card-body">
              <h5 class="card-title text-truncate" title="${product.title}">${
          product.title
        }</h5>
              <p class="card-text text-success fw-bold">$${product.price.toFixed(
                2
              )}</p>
              <button class="btn btn-primary w-100 view-product-btn" data-product-id="${
                product.id
              }">View Details</button>
            </div>
          </div>
        </div>`
      )
      .join("");

    // Add event listeners for "View Details" buttons
    document.querySelectorAll(".view-product-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const productId = button.getAttribute("data-product-id");
        displayProductDetails(productId);
      });
    });
  } catch (error) {
    console.error("Error displaying products:", error);
    productGrid.innerHTML = `<p class="text-danger">Failed to load products. Please try again later.</p>`;
  }
}

/**
 * Display details of a single product.
 * @param {string} productId - The ID of the product to display.
 */
async function displayProductDetails(productId) {
  const productGrid = document.getElementById("product-grid");

  if (!productGrid) {
    console.error("Product grid element not found.");
    return;
  }

  try {
    const product = await fetchProductById(productId);

    if (!product) {
      productGrid.innerHTML = `<p class="text-danger">Failed to load product details. Please try again later.</p>`;
      return;
    }

    productGrid.innerHTML = `
      <div class="col-12">
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" class="card-img-top mx-auto" alt="${
      product.title
    }" style="height: 300px; width: auto; object-fit: contain;">
          <div class="card-body">
            <h3 class="card-title">${product.title}</h3>
            <p class="card-text">${product.description}</p>
            <p class="card-text text-success fw-bold">$${product.price.toFixed(
              2
            )}</p>
            <p class="card-text">Rating: ${product.rating.rate} (${
      product.rating.count
    } reviews)</p>
            <button class="btn btn-primary w-100 add-to-cart-btn" data-product-id="${
              product.id
            }">Add to Cart</button>
          </div>
        </div>
        <button class="btn btn-secondary mt-2" id="back-to-products">Back to Products</button>
      </div>
    `;

    // Add event listener for the "Back to Products" button
    document
      .getElementById("back-to-products")
      .addEventListener("click", () => {
        displayProducts();
      });

    // Add to cart functionality
    document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
      addToCart(product.id);
    });
  } catch (error) {
    console.error("Error displaying product details:", error);
    productGrid.innerHTML = `<p class="text-danger">Failed to load product details. Please try again later.</p>`;
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  displayCategories(); // Fetch and display categories
  displayProducts(); // Fetch and display all products initially
});

/**
 * Get the cart from localStorage.
 * @returns {Array} The cart items.
 */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

/**
 * Save the cart to localStorage.
 * @param {Array} cart - The cart items to save.
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Add an item to the cart and update the badge.
 * @param {number} productId - The ID of the product to add.
 */
function addToCart(productId) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  alert("Item added to cart!");
}

/**
 * Update the cart badge with the number of items.
 */
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
