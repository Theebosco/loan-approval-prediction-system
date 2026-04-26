const API_BASE_URL = "http://localhost:5000";

const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  message.style.color = "#00b050";
  message.textContent = "Creating account...";

  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    message.style.color = "#00b050";
    message.textContent = "Registration successful. Redirecting to login...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);

  } catch (error) {
    message.style.color = "red";

    if (error.message === "Failed to fetch") {
      message.textContent = "Cannot connect to backend. Make sure backend is running on http://localhost:5000";
    } else {
      message.textContent = error.message;
    }
  }
});