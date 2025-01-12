var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export function loadComponent(url, placeholderId) {
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
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    yield loadComponent("../components/header.html", "header-placeholder");
    yield loadComponent("../components/footer.html", "footer-placeholder");
    updateCartBadge();
}));
const form = document.querySelector(".contact-form");
if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Thank you! Your message has been sent.");
        form.reset();
    });
}
