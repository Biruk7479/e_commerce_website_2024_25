// Fetch orders from the backend and display them
async function displayOrders() {
  const ordersContainer = document.getElementById("orders-container");
  const loadingSpinner = document.getElementById("loading-spinner");

  try {
    // Show the loading spinner while fetching data
    loadingSpinner.style.display = "block";

    const response = await fetch("http://localhost:8000/orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // JWT token from localStorage
      },
    });

    // Hide the loading spinner once the request is complete
    loadingSpinner.style.display = "none";

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await response.json();
    const orders = data.orders;

    if (orders.length === 0) {
      ordersContainer.innerHTML = `<p class="text-center">No orders available.</p>`;
      return;
    }

    // Create HTML structure for each order
    ordersContainer.innerHTML = orders
      .map((order) => {
        // Create product list based on order.products
        const productList = order.products
          .map((product) => {
            const productTitle = product.productId
              ? product.productId.title
              : "Unknown Product";
            const productPrice =
              product.productId && product.productId.price
                ? product.productId.price.toFixed(2)
                : "N/A";
            return ` 
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${productTitle} (x${product.quantity || 1})</span>
                <span>$${productPrice}</span>
              </li>`;
          })
          .join("");

        return ` 
          <div class="card mb-4" data-order-id="${order._id}">
            <div class="card-body">
              <h5 class="card-title">Order #${order._id}</h5>
              <p><strong>Status:</strong> ${order.state}</p>
              <p><strong>Shipping to:</strong> ${order.address}</p>
              <h6>Products:</h6>
              <ul class="list-group mb-3">
                ${productList}
              </ul>
              <div class="d-flex justify-content-between">
                ${
                  order.state === "Pending"
                    ? `<button class="btn btn-outline-success mark-received-btn" data-order-id="${order._id}">
                    Mark as Received
                  </button>`
                    : ""
                }
                <button class="btn btn-outline-danger remove-btn" data-order-id="${
                  order._id
                }">
                  Remove Order
                </button>
              </div>
            </div>
          </div>`;
      })
      .join("");

    // Add event listeners for "Mark as Received" and "Remove" buttons
    document.querySelectorAll(".mark-received-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const orderId = e.target.getAttribute("data-order-id");
        markOrderAsReceived(orderId);
      });
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const orderId = e.target.getAttribute("data-order-id");
        removeOrder(orderId);
      });
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    ordersContainer.innerHTML = `<p class="text-center text-danger">Failed to load orders. Please try again later.</p>`;
  }
}

// Mark an order as received
async function markOrderAsReceived(orderId) {
  if (confirm("Are you sure you want to mark this order as received?")) {
    try {
      const response = await fetch(
        `http://localhost:8000/orders/${orderId}/received`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Order marked as received.");
        displayOrders(); // Reload the orders after the action
      } else {
        alert("Failed to update the order.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred while updating the order.");
    }
  }
}

// Remove an order
async function removeOrder(orderId) {
  if (confirm("Are you sure you want to remove this order?")) {
    try {
      const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        alert("Order removed successfully.");
        displayOrders(); // Reload the orders after the action
      } else {
        alert("Failed to remove the order.");
      }
    } catch (error) {
      console.error("Error removing order:", error);
      alert("An error occurred while removing the order.");
    }
  }
}

// Initialize the orders page
document.addEventListener("DOMContentLoaded", () => {
  displayOrders();
});
document.getElementById("logout-btn").addEventListener("click", async () => {
  const token = localStorage.getItem("authToken"); // Get the stored token

  if (token) {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token as authorization header
        },
      });

      const data = await response.json();

      if (response.ok) {
        // On success, remove the token and handle UI changes
        localStorage.removeItem("authToken");
        alert(data.message); // Show logout success message
        window.location.href = "../pages/login.html"; // Redirect to login page, or show login UI
      } else {
        // Handle error (token invalid, etc.)
        alert("Logout failed: " + data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  }
});
