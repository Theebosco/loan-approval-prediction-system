const featureImportanceData = [
  { feature: "Credit History", importance: 0.42 },
  { feature: "Applicant Income", importance: 0.21 },
  { feature: "Loan Amount", importance: 0.16 },
  { feature: "Co-applicant Income", importance: 0.09 },
  { feature: "Education", importance: 0.07 },
  { feature: "Employment Status", importance: 0.05 }
];

new Chart(document.getElementById("featureImportanceChart"), {
  type: "bar",
  data: {
    labels: featureImportanceData.map(item => item.feature),
    datasets: [
      {
        label: "Importance Score",
        data: featureImportanceData.map(item => item.importance)
      }
    ]
  },
  options: {
    indexAxis: "y"
  }
});