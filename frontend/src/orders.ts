// Fetch orders from the backend and display them
async function displayOrders() {
  try {
    const authToken = localStorage.getItem("authToken"); // Get the authToken from storage or wherever it's stored
    const response = await fetch("http://localhost:8000/orders", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();
    const orders = data.orders;
    const ordersContainer = document.getElementById("orders-container");

    if (orders.length === 0) {
      ordersContainer.innerHTML = `
        <div class="text-center">
          <p>You have no orders. Add items to your cart and check them out!</p>
        </div>`;
      return;
    }

    // Create HTML structure for each order
    ordersContainer.innerHTML = orders
      .map((order) => {
        const productList = order.products
          .map((product) => {
            const productId = product.productId;
            const productTitle = productId
              ? productId.title
              : "Unknown Product";
            const productPrice =
              productId && productId.price ? productId.price.toFixed(2) : "N/A";

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
              <button class="btn btn-success mark-received-btn" data-order-id="${order._id}">
                Mark as Received
              </button>
              <button class="btn btn-danger remove-order-btn" data-order-id="${order._id}">
                Remove Order
              </button>
            </div>
          </div>`;
      })
      .join("");

    // Add event listeners for "Mark as Received" buttons
    document.querySelectorAll(".mark-received-btn").forEach((button) => {
      button.addEventListener("click", (e: any) => {
        const orderId = e.target.getAttribute("data-order-id");
        markOrderAsReceived(orderId);
      });
    });

    // Add event listeners for "Remove Order" buttons
    document.querySelectorAll(".remove-order-btn").forEach((button) => {
      button.addEventListener("click", (e: any) => {
        const orderId = e.target.getAttribute("data-order-id");
        removeOrder(orderId);
      });
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

// Mark an order as received
async function markOrderAsReceived(orderId) {
  if (confirm("Are you sure you want to mark this order as received?")) {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8000/orders/${orderId}/received`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Thank you! Your order has been marked as received.");
        // Optionally, refresh the list of orders
        displayOrders();
      } else {
        alert("Failed to update the order status.");
      }
    } catch (error) {
      console.error("Error updating the order:", error);
      alert("An error occurred while updating the order.");
    }
  }
}

// Remove an order after it's marked as received
async function removeOrder(orderId) {
  if (confirm("Are you sure you want to remove this order?")) {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        alert("Order removed successfully.");
        // Remove the order from the DOM
        const orderElement = document.querySelector(
          `[data-order-id="${orderId}"]`
        );
        if (orderElement) {
          orderElement.remove();
        }
      } else {
        alert("Failed to remove the order.");
      }
    } catch (error) {
      console.error("Error deleting the order:", error);
      alert("An error occurred while deleting the order.");
    }
  }
}

// Initialize the orders page
document.addEventListener("DOMContentLoaded", () => {
  displayOrders();
});
