// import { loadComponent } from "../assets/fetch-api/api.js";
import updateCartBadge from "./updateCartBadge.js";
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
  await loadComponent("../components/header.html", "header-placeholder");
  await loadComponent("../components/footer.html", "footer-placeholder");

  updateCartBadge();
});
