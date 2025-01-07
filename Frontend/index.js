function showSearch() {
    var searchBar = document.getElementById('searchBar');
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
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return response.json();
    })
        .then(function (products) {
        var container = document.getElementById("products-container");
        if (container) {
            // Clear the container in case there's any existing content
            container.innerHTML = "";
            // Loop through the products and create HTML for each
            products.forEach(function (product) {
                var productElement = document.createElement("div");
                productElement.className = "product-item";
                productElement.innerHTML = "\n          <div class=\"m-2 mb-4\">\n              <img src=\"".concat(product.image, "\" style=\"max-width: 240px; height: auto;\" alt=\"").concat(product.name, "\">\n              <h6 style=\"font-size: 14px; margin-top: 0.5rem; width:200px\">").concat(product.name, "</h6>\n              <p style=\"margin-top: 0.2rem; font-size: 13px;\">$").concat(product.price.toFixed(2), "</p>\n          </div>\n      ");
                // Append each product to the container
                container.appendChild(productElement);
            });
        }
    })
        .catch(function (error) { return console.error("Error:", error); });
}
// Call the function on page load
document.addEventListener("DOMContentLoaded", displayProducts);
