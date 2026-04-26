const prediction = JSON.parse(localStorage.getItem("latestPrediction"));

const resultBox = document.getElementById("resultBox");
const scoreText = document.getElementById("scoreText");

if (!prediction) {
  resultBox.textContent = "No result found. Please submit an application first.";
  resultBox.className = "result-box rejected";
} else {
  if (prediction.decision === "Approved") {
    resultBox.textContent = "Congratulations! Loan Approved.";
    resultBox.className = "result-box approved";
  } else {
    resultBox.textContent = "Sorry, Loan Rejected.";
    resultBox.className = "result-box rejected";
  }

  scoreText.textContent = "Risk Score: " + prediction.riskScore + "/100";
}