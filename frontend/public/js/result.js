const prediction = JSON.parse(localStorage.getItem("latestPrediction"));

const resultBox = document.getElementById("resultBox");
const scoreText = document.getElementById("scoreText");

const setResultStyle = (variant) => {
  if (variant === "approved") {
    resultBox.className = "mx-auto flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-6 text-2xl font-semibold text-emerald-800";
  } else {
    resultBox.className = "mx-auto flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 py-6 text-2xl font-semibold text-rose-700";
  }
};

if (!prediction) {
  resultBox.textContent = "No result found. Please submit an application first.";
  setResultStyle("rejected");
} else {
  if (prediction.decision === "Approved") {
    resultBox.textContent = "Congratulations! Loan Approved.";
    setResultStyle("approved");
  } else {
    resultBox.textContent = "Sorry, Loan Rejected.";
    setResultStyle("rejected");
  }

  scoreText.textContent = "Risk Score: " + prediction.riskScore + "/100";
}