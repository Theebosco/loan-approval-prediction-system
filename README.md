# Loan Approval Prediction System

This is a separated frontend and backend JavaScript project.

## Project Structure

```text
loan-approval-prediction-system/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── models/
│       └── predictionModel.js
│
├── frontend/
│   ├── package.json
│   └── public/
│       ├── index.html
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── app.js
```

## Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs using live-server.

## MongoDB

Make sure MongoDB is installed and running locally.

Default connection:

```text
mongodb://127.0.0.1:27017
```

Database name:

```text
loanApprovalPredictionDB
```

## Prediction Output

The system predicts one of these decisions:

- Approved
- Rejected
- Manual Review
