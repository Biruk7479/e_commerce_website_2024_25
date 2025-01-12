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

export async function loadComponent(url: any, placeholderId: any) {
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
  await loadComponent("../components/header.html", "header-placeholder");
  await loadComponent("../components/footer.html", "footer-placeholder");

  updateCartBadge();
});

const form: any = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you! Your message has been sent.");
    form.reset();
  });
}
