require("dotenv").config();

const http = require("http");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const predictLoan = require("./models/predictionModel");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "smartloan_secret_key_123";

let db;

const client = new MongoClient(MONGO_URI);

async function connectDatabase() {
  try {
    await client.connect();
    db = client.db("loanApprovalDB");
    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });

  res.end(JSON.stringify(data));
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function getUserFromToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && req.url === "/") {
      sendJSON(res, 200, {
        success: true,
        message: "Loan Approval Prediction API is running"
      });
      return;
    }

    if (!db) {
      sendJSON(res, 500, {
        success: false,
        message: "Database not connected"
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/register") {
      const data = await getRequestBody(req);

      if (!data.fullName || !data.email || !data.password) {
        sendJSON(res, 400, {
          success: false,
          message: "Full name, email and password are required"
        });
        return;
      }

      const existingUser = await db.collection("users").findOne({
        email: data.email
      });

      if (existingUser) {
        sendJSON(res, 400, {
          success: false,
          message: "User already exists"
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      await db.collection("users").insertOne({
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        createdAt: new Date()
      });

      sendJSON(res, 201, {
        success: true,
        message: "User registered successfully"
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/login") {
      const data = await getRequestBody(req);

      if (!data.email || !data.password) {
        sendJSON(res, 400, {
          success: false,
          message: "Email and password are required"
        });
        return;
      }

      const user = await db.collection("users").findOne({
        email: data.email
      });

      if (!user) {
        sendJSON(res, 401, {
          success: false,
          message: "Invalid email or password"
        });
        return;
      }

      const passwordMatch = await bcrypt.compare(data.password, user.password);

      if (!passwordMatch) {
        sendJSON(res, 401, {
          success: false,
          message: "Invalid email or password"
        });
        return;
      }

      const token = jwt.sign(
        {
          userId: user._id.toString(),
          fullName: user.fullName,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      sendJSON(res, 200, {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email
        }
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/predict") {
      const loggedInUser = getUserFromToken(req);

      if (!loggedInUser) {
        sendJSON(res, 401, {
          success: false,
          message: "Unauthorized. Please login first."
        });
        return;
      }

      const data = await getRequestBody(req);
      const prediction = predictLoan(data);

      const record = {
        userId: loggedInUser.userId,
        userEmail: loggedInUser.email,
        fullName: loggedInUser.fullName,
        ...data,
        decision: prediction.decision,
        status: prediction.decision,
        riskScore: prediction.riskScore,
        createdAt: new Date()
      };

      const result = await db.collection("loans").insertOne(record);

      sendJSON(res, 201, {
        success: true,
        message: "Prediction completed successfully",
        data: {
          _id: result.insertedId,
          ...record
        }
      });
      return;
    }

    if (req.method === "GET" && req.url === "/api/dashboard") {
      const loggedInUser = getUserFromToken(req);

      if (!loggedInUser) {
        sendJSON(res, 401, {
          success: false,
          message: "Unauthorized. Please login first."
        });
        return;
      }

      const loans = await db.collection("loans").find().toArray();

      const totalRecords = loans.length;
      const approved = loans.filter(loan => loan.decision === "Approved").length;
      const rejected = loans.filter(loan => loan.decision === "Rejected").length;

      const approvalRate =
        totalRecords > 0 ? ((approved / totalRecords) * 100).toFixed(1) : 0;

      const avgLoanAmount =
        totalRecords > 0
          ? (
              loans.reduce((sum, loan) => sum + Number(loan.loanAmount || 0), 0) /
              totalRecords
            ).toFixed(0)
          : 0;

      sendJSON(res, 200, {
        success: true,
        data: {
          totalRecords,
          approvalRate,
          avgLoanAmount,
          approved,
          rejected,
          creditHistoryChart: {
            goodCredit: {
              approved: loans.filter(
                loan => Number(loan.creditHistory) === 1 && loan.decision === "Approved"
              ).length,
              rejected: loans.filter(
                loan => Number(loan.creditHistory) === 1 && loan.decision === "Rejected"
              ).length
            },
            badCredit: {
              approved: loans.filter(
                loan => Number(loan.creditHistory) === 0 && loan.decision === "Approved"
              ).length,
              rejected: loans.filter(
                loan => Number(loan.creditHistory) === 0 && loan.decision === "Rejected"
              ).length
            }
          },
          approvalDistribution: {
            approved,
            rejected
          }
        }
      });
      return;
    }

    if (req.method === "GET" && req.url === "/api/model-insights") {
      sendJSON(res, 200, {
        success: true,
        data: {
          modelName: "Random Forest Classifier",
          accuracy: "82%",
          featureImportance: [
            { feature: "Credit History", importance: 0.42 },
            { feature: "Applicant Income", importance: 0.21 },
            { feature: "Loan Amount", importance: 0.16 },
            { feature: "Co-applicant Income", importance: 0.09 },
            { feature: "Education", importance: 0.07 },
            { feature: "Employment Status", importance: 0.05 }
          ],
          confusionMatrix: {
            trueApproved: 92,
            falseApproved: 14,
            falseRejected: 18,
            trueRejected: 65
          }
        }
      });
      return;
    }

    sendJSON(res, 404, {
      success: false,
      message: "Route not found"
    });

  } catch (error) {
    sendJSON(res, 500, {
      success: false,
      message: error.message
    });
  }
});

connectDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
});