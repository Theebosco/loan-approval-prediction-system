function predictLoan(data) {
  const applicantIncome = Number(data.applicantIncome || 0);
  const coapplicantIncome = Number(data.coapplicantIncome || 0);
  const loanAmount = Number(data.loanAmount || 0);
  const creditHistory = Number(data.creditHistory || 0);

  const totalIncome = applicantIncome + coapplicantIncome;

  let score = 0;

  if (creditHistory === 1) score += 45;

  if (totalIncome >= 10000) {
    score += 30;
  } else if (totalIncome >= 5000) {
    score += 20;
  } else if (totalIncome >= 3000) {
    score += 10;
  }

  if (loanAmount <= 150) {
    score += 15;
  } else if (loanAmount <= 300) {
    score += 10;
  } else {
    score += 3;
  }

  if (data.education === "Graduate") score += 5;

  if (data.employmentStatus === "Employed") {
    score += 5;
  } else if (data.employmentStatus === "Self Employed") {
    score += 3;
  } else if (data.employmentStatus === "Not Employed") {
    score -= 10;
  }

  const decision = score >= 60 ? "Approved" : "Rejected";

  return {
    decision,
    riskScore: score
  };
}

module.exports = predictLoan;