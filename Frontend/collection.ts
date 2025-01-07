function showSearch(): void {
    const searchBar = document.getElementById('searchBar');
  
    if (searchBar) {
      // Ensure the element exists and has a classList
      if (searchBar.classList.contains('d-none')) {
        searchBar.classList.remove('d-none');
      } else {
        searchBar.classList.add('d-none');
      }
    } else {
      console.error('Element with id "searchBar" not found');
    }
  }
  
  
  

// Interface for product type
interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
  }
  
  // Function to fetch and display products
  function displayProducts(): void {
    // Fetch the product data from the JSON file
    fetch("products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((products: Product[]) => {
        const container = document.getElementById("products-container");
  
        if (container) {
          // Clear the container in case there's any existing content
          container.innerHTML = "";
  
          // Loop through the products and create HTML for each
          products.forEach((product) => {
            const productElement = document.createElement("div");
            productElement.className = "product-item";
  
            productElement.innerHTML = `
            <div class="mx-2 mb-4">
                <img src="${product.image}" style="max-width: 250px; height: auto;" alt="${product.name}">
                <h6 style="font-size: 14px; margin-top: 0.5rem; width:200px">${product.name}</h6>
                <p style="margin-top: 0.2rem; font-size: 13px;">$${product.price.toFixed(2)}</p>
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
  