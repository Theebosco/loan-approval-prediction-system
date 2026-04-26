const API_BASE_URL = "https://loan-approval-prediction-system-production.up.railway.app";

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first before applying for a loan.");
  window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}

const form = document.getElementById("predictorForm");
const message = document.getElementById("message");

form.addEventListener("submit", async event => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.applicantIncome = Number(data.applicantIncome);
  data.coapplicantIncome = Number(data.coapplicantIncome);
  data.loanAmount = Number(data.loanAmount);
  data.creditHistory = Number(data.creditHistory);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Application failed");
    }

    localStorage.setItem("latestPrediction", JSON.stringify(result.data));

    window.location.href = "result.html";

  } catch (error) {
    message.style.color = "red";
    message.textContent = error.message;
  }
});