/// HTTP SERVER

const countClients = server => [...server.clients].length;

const http = require("http");
const httpPort = 8000;
const requestHandler = (request, response) => {
  console.log(request.url);
  response.end("Hello Node.js Server!");
};
const httpServer = http.createServer(requestHandler);
httpServer.listen(httpPort, err => {
  if (err) {
    return console.log("An error occured: ", err);
  }
  console.log(`httpServer is listening on ${httpPort}`);
});

/// WS SERVER

const WebSocket = require("ws");
const port = 8080;
const server = new WebSocket.Server({ port });
server.on("connection", function connection(socket) {
  console.log("connection established");
  socket.on("message", function incoming(message) {
    /// socket.send(`received: ${message}`);
    server.clients.forEach(client => {
      if (client.readyState !== WebSocket.OPEN) {
        return;
      }
      client.send(`new message: ${message}`);
    });
    console.log("received: %s", message);
  });
  socket.on("close", function closing(message) {
    const disconnectMessage = `machine disconnected to a total of ${countClients(
      server
    )}`;
    console.log(disconnectMessage);
    server.clients.forEach(client => {
      if (client.readyState !== WebSocket.OPEN) {
        return;
      }
      client.send(disconnectMessage);
    });
  });
  const numberOfClients = countClients(server);
  const connectMessage = `new machine connected to a total of ${countClients(
    server
  )}`;
  console.log(connectMessage);
  server.clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) {
      return;
    }
    client.send(connectMessage);
  });
});
console.log(
  `Broadcasting WebSocket server listening for incoming websocket connections on port ${
    port
  }`
);
