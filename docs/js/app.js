const API_URL = 'http://localhost:5000/api/loans';

const form = document.getElementById('loanForm');
const message = document.getElementById('message');
const loansList = document.getElementById('loansList');
const loadLoansButton = document.getElementById('loadLoans');

form.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.monthlyIncome = Number(data.monthlyIncome);
  data.loanAmount = Number(data.loanAmount);
  data.existingDebt = Number(data.existingDebt || 0);
  data.creditScore = Number(data.creditScore || 0);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit application');
    }

    message.textContent = `Prediction complete. Decision: ${result.data.decision} | Risk Score: ${result.data.riskScore}/100`;
    message.style.color = 'green';
    form.reset();
    loadLoans();
  } catch (error) {
    message.textContent = error.message;
    message.style.color = 'red';
  }
});

loadLoansButton.addEventListener('click', loadLoans);

async function loadLoans() {
  loansList.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to load applications');
    }

    if (result.data.length === 0) {
      loansList.innerHTML = '<p>No loan applications found.</p>';
      return;
    }

    loansList.innerHTML = result.data.map(loan => `
      <div class="loan-item">
        <h3>${loan.fullName}</h3>
        <p><strong>Email:</strong> ${loan.email}</p>
        <p><strong>Phone:</strong> ${loan.phone}</p>
        <p><strong>Employment:</strong> ${loan.employmentStatus}</p>
        <p><strong>Loan Amount:</strong> ${loan.loanAmount}</p>
        <p><strong>Monthly Income:</strong> ${loan.monthlyIncome}</p>
        <p><strong>Existing Debt:</strong> ${loan.existingDebt}</p>
        <p><strong>Credit Score:</strong> ${loan.creditScore}</p>
        <p><strong>Risk Score:</strong> ${loan.riskScore}/100</p>
        <p><strong>Decision:</strong> ${loan.decision}</p>
        <span class="status ${getStatusClass(loan.status)}">${loan.status}</span>
      </div>
    `).join('');
  } catch (error) {
    loansList.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

function getStatusClass(status) {
  if (status === 'Approved') return 'approved';
  if (status === 'Rejected') return 'rejected';
  return 'review';
}

loadLoans();
