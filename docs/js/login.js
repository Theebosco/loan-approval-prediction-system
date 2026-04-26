const API_BASE_URL = "http://localhost:5000";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  message.style.color = "#00b050";
  message.textContent = "Logging in...";

  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));

    message.style.color = "#00b050";
    message.textContent = "Login successful. Redirecting to dashboard...";

    setTimeout(() => {
      window.location.href = "dashboard.html";
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