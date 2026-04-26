const API_BASE_URL = "https://loan-approval-prediction-system-production.up.railway.app";
const API_URL = `${API_BASE_URL}/api/dashboard`;

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first.");
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

async function loadDashboard() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to load dashboard");
    }

    const data = result.data;

    document.getElementById("total").textContent = data.totalRecords;
    document.getElementById("approvalRate").textContent = data.approvalRate + "%";
    document.getElementById("avgLoan").textContent = data.avgLoanAmount;

    new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
        labels: ["Good Credit History", "Bad Credit History"],
        datasets: [
          {
            label: "Approved",
            data: [
              data.creditHistoryChart.goodCredit.approved,
              data.creditHistoryChart.badCredit.approved
            ],
            backgroundColor: "#00b050"
          },
          {
            label: "Rejected",
            data: [
              data.creditHistoryChart.goodCredit.rejected,
              data.creditHistoryChart.badCredit.rejected
            ],
            backgroundColor: "#ff4d4d"
          }
        ]
      }
    });

    new Chart(document.getElementById("pieChart"), {
      type: "pie",
      data: {
        labels: ["Approved", "Rejected"],
        datasets: [
          {
            data: [
              data.approvalDistribution.approved,
              data.approvalDistribution.rejected
            ],
            backgroundColor: ["#00b050", "#ff4d4d"]
          }
        ]
      }
    });

  } catch (error) {
    alert(error.message);

    if (
      error.message.includes("Unauthorized") ||
      error.message.includes("Please login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    }
  }
}

loadDashboard();