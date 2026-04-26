const http = require("http");
const fs = require("fs");
const path = require("path");

const BASE_PORT = 3000;
const baseDir = path.join(__dirname, "public");

function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join(
      baseDir,
      req.url === "/" ? "index.html" : req.url
    );

    const ext = path.extname(filePath);

    const contentType = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css"
    }[ext] || "text/plain";

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end("File not found");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }
    });
  });
}

function startServer(port) {
  const server = createServer();

  server.listen(port, () => {
    console.log(`Frontend running on http://localhost:${port}`);
  });

  server.on("error", err => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} busy, trying ${port + 1}...`);
      startServer(port + 1); // create NEW server instance
    } else {
      console.error(err);
    }
  });
}

startServer(BASE_PORT);