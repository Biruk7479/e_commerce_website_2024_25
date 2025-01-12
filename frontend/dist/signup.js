var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.querySelector("form");
    signUpForm === null || signUpForm === void 0 ? void 0 : signUpForm.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        e.preventDefault(); // Prevent the default form submission
        function loadComponent(url, placeholderId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to load component: ${url}`);
                    }
                    const content = yield response.text();
                    document.getElementById(placeholderId).innerHTML = content;
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
            yield loadComponent("../components/header.html", "header-placeholder");
            yield loadComponent("../components/footer.html", "footer-placeholder");
            // Initialize the cart badge on page load
        }));
        // Get the form data
        const name = (_a = document.querySelector("input[placeholder='Name']")) === null || _a === void 0 ? void 0 : _a.value.trim();
        const email = document.querySelector("input[placeholder='Email']").value.trim();
        const password = document.querySelector("input[placeholder='Password']").value.trim();
        // Basic form validation
        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }
        // Create the request payload
        const signUpData = {
            name,
            email,
            password,
        };
        try {
            // Make a POST request to the signup endpoint
            const response = yield fetch("http://localhost:8000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signUpData),
            });
            // Check if the response is successful
            if (!response.ok) {
                const errorData = yield response.json();
                alert(`Error: ${errorData.message || "Something went wrong."}`);
                return;
            }
            // Handle the response (JWT token)
            const responseData = yield response.json();
            localStorage.setItem("token", responseData.token); // Store the token in localStorage (for further use, e.g., authentication)
            alert("Sign up successful! Redirecting to login...");
            window.location.href = "login.html"; // Redirect to login page after successful sign up
        }
        catch (error) {
            console.error("Error during sign up:", error);
            alert("An error occurred while signing up.");
        }
    }));
});
