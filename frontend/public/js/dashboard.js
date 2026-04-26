const API_URL = "http://localhost:5000/api/dashboard";

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
            ]
          },
          {
            label: "Rejected",
            data: [
              data.creditHistoryChart.goodCredit.rejected,
              data.creditHistoryChart.badCredit.rejected
            ]
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
            ]
          }
        ]
      }
    });

  } catch (error) {
    alert(error.message);

    if (error.message.includes("Unauthorized")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    }
  }
}

loadDashboard();