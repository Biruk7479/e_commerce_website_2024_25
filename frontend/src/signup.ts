document.addEventListener("DOMContentLoaded", () => {
  const signUpForm: any = document.querySelector("form");

  signUpForm?.addEventListener("submit", async (e: any) => {
    e.preventDefault(); // Prevent the default form submission

    async function loadComponent(url: any, placeholderId: any) {
      try {
        const response: any = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load component: ${url}`);
        }
        const content: any = await response.text();
        document.getElementById(placeholderId).innerHTML = content;
      } catch (error) {
        console.error(error);
      }
    }

    document.addEventListener("DOMContentLoaded", async () => {
      await loadComponent("../components/header.html", "header-placeholder");
      await loadComponent("../components/footer.html", "footer-placeholder");
      // Initialize the cart badge on page load
    });
    // Get the form data
    const name: any = (
      document.querySelector("input[placeholder='Name']") as HTMLInputElement
    )?.value.trim();
    const email = (
      document.querySelector("input[placeholder='Email']") as HTMLInputElement
    ).value.trim();
    const password = (
      document.querySelector(
        "input[placeholder='Password']"
      ) as HTMLInputElement
    ).value.trim();

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
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Something went wrong."}`);
        return;
      }

      // Handle the response (JWT token)
      const responseData = await response.json();
      localStorage.setItem("token", responseData.token); // Store the token in localStorage (for further use, e.g., authentication)

      alert("Sign up successful! Redirecting to login...");
      window.location.href = "login.html"; // Redirect to login page after successful sign up
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("An error occurred while signing up.");
    }
  });
});
