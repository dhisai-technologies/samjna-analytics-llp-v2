const http = require("node:http");
const httpProxy = require("http-proxy");
const { apps, config } = require("./config");

const proxy = httpProxy.createProxyServer({});

proxy.on("error", (err, _req, res) => {
  console.error("Proxy error:", err);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Something went wrong.");
});

const server = http.createServer((req, res) => {
  for (const { path, port } of apps) {
    if (req.url.startsWith(path)) {
      proxy.web(req, res, {
        target: `http://localhost:${port}`,
      });
      return;
    }
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

// Handle WebSocket upgrade requests
server.on("upgrade", (req, socket, head) => {
  for (const { path, port } of apps) {
    if (req.url.startsWith(path)) {
      proxy.ws(req, socket, head, {
        target: `http://localhost:${port}`,
      });
      socket.on("error", (_) => {
        socket.destroy();
      });
      return;
    }
  }
  socket.destroy();
});

console.log(`✨ Proxy server listening on port ${config.PROXY_PORT}`);
server.listen(config.PROXY_PORT);
