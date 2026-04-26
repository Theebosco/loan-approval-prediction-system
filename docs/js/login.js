const API_BASE_URL = "https://loan-approval-prediction-system-production.up.railway.app";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  message.style.color = "#00b050";
  message.textContent = "Logging in...";

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

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

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (error) {
    message.style.color = "red";
    message.textContent = error.message || "Something went wrong";
  }
});