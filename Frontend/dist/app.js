"use strict";
function showSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        // Ensure the element exists and has a classList
        if (searchBar.classList.contains('d-none')) {
            searchBar.classList.remove('d-none');
        }
        else {
            searchBar.classList.add('d-none');
        }
    }
    else {
        console.error('Element with id "searchBar" not found');
    }
}
// Function to fetch and display products
function displayProducts() {
    // Fetch the product data from the JSON file
    fetch("products.json")
        .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return response.json();
    })
        .then((products) => {
        const container = document.getElementById("products-container");
        if (container) {
            // Clear the container in case there's any existing content
            container.innerHTML = "";
            // Loop through the products and create HTML for each
            products.forEach((product) => {
                const productElement = document.createElement("div");
                productElement.className = "product-item";
                productElement.innerHTML = `
            <div class="card mb-4" style="width: 18rem;">
              <img src="${product.image}" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">$${product.price.toFixed(2)}</p>
              </div>
            </div>
          `;
                // Append each product to the container
                container.appendChild(productElement);
            });
        }
    })
        .catch((error) => console.error("Error:", error));
}
// Call the function on page load
document.addEventListener("DOMContentLoaded", displayProducts);
