// login.js
async function loadComponent(url: any, placeholderId: any) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${url}`);
    }
    const content = await response.text();
    document.getElementById(placeholderId).innerHTML = content;
  } catch (error) {
    console.error(error);
    document.getElementById(placeholderId).innerHTML =
      "<p>Unable to load content. Please try again later.</p>";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("../components/header.html", "header-placeholder");
  await loadComponent("../components/footer.html", "footer-placeholder");

  initLoginForm();
});

async function handleLogin(event) {
  event.preventDefault();

  const emailInput: any = document.querySelector('input[type="email"]');
  const passwordInput: any = document.querySelector('input[type="password"]');
  const email: any = emailInput.value.trim();
  const password: any = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  // Email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    document.body.style.cursor = "wait";

    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log(response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Login failed.");
    }

    const { token } = await response.json();
    localStorage.setItem("authToken", token);

    const decoded = decodeJWT(token);

    const userRole = decoded.role;
    console.log(window.location.href);
    if (userRole[0] === "admin") {
      window.location.href =
        "http://127.0.0.1:5500/final_final/final/final/frontend/admin/index.html";
    } else if (userRole[0] === "user") {
      window.location.href = "index.html";
    } else {
      alert("Unknown user role. Please contact support.");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    alert("Invalid email or password. Please try again.");
  } finally {
    document.body.style.cursor = "default";
  }
}

function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Convert to base64 format
    const decoded = JSON.parse(window.atob(base64)); // Decode the base64 part
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return {};
  }
}

function initLoginForm() {
  const loginForm = document.querySelector("form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}
