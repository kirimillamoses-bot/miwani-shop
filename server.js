const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

http
  .createServer((req, res) => {
    let filePath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          fs.readFile(path.join(__dirname, "index.html"), (e, d) => {
            res.writeHead(e ? 500 : 200, { "Content-Type": "text/html" });
            res.end(e ? "Server Error" : d);
          });
        } else {
          res.writeHead(500);
          res.end("Server Error");
        }
        return;
      }
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
      });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log(`Miwani shop running on port ${PORT}`));
