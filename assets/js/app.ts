// // assets/js/app.ts

// /**
//  * Fetches an HTML component and injects it into a DOM element.
//  * @param {string} url - The URL of the HTML file to fetch.
//  * @param {string} placeholderId - The ID of the DOM element where the content will be injected.
//  */
// async function loadComponent(
//   url: string,
//   placeholderId: string
// ): Promise<void> {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Failed to load ${url}: ${response.statusText}`);
//     }
//     const htmlContent = await response.text();
//     const placeholder = document.getElementById(placeholderId);
//     if (placeholder) {
//       placeholder.innerHTML = htmlContent;
//     }
//   } catch (error) {
//     console.error(`Error loading component: ${error.message}`);
//   }
// }

// // Load Header and Footer
// document.addEventListener("DOMContentLoaded", () => {
//   loadComponent("./components/header.html", "header-placeholder");
//   loadComponent("./components/footer.html", "footer-placeholder");
// });
