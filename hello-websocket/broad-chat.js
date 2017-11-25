// content of index.js

const WebSocket = require("ws");

const port = 8080;

const server = new WebSocket.Server({ port });

const sendJson = socket => messageObject =>
  socket.send(JSON.stringify(messageObject));

const broadcast = (clients, messageType, messageObject) => {
  clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) {
      return;
    }
    client.sendJson({
      ...baseParams(messageType),
      ...messageObject,
    });
  });
};

MessageType = {
  RequestName: "RequestName",
  SendName: "SendName",
  Info: "Info",
  ChatMessage: "ChatMessage",
  ChatMessageToServer: "ChatMessageToServer",
  ClientNames: "ClientNames",
};

let nextUserId = 0;
let nextMessageId = 0;

const baseParams = type => ({
  id: nextMessageId++,
  type: type,
  timestamp: Date.now(),
});

console.log("Broadcasting WebSocket server started on port %i", port);

const getNames = clients =>
  clients.reduce((names, client) => {
    if (!client.meta || !client.meta.name) {
      return names;
    }
    names.push(client.meta.name);
    return names;
  }, []);

server.on("connection", function connection(socket) {
  socket.meta = {};
  socket.meta.id = nextUserId++;
  socket.sendJson = sendJson(socket);
  socket.sendJson({ ...baseParams(MessageType.RequestName) });
  console.log("connection established");
  socket.on("message", function incoming(message) {
    console.log(message);
    const messageObj = JSON.parse(message);
    console.log(messageObj);
    if (messageObj.type === MessageType.SendName) {
      socket.meta.name = messageObj.name;
      const participants = getNames([...server.clients]);
      console.log("NEW PARTICIPANT " + socket.meta.name);
      console.log("ALL PARTICIPANTS: " + participants);
      /// TODO refactor into broadcast function
      broadcast(server.clients, MessageType.ClientNames, {
        clientNames: participants,
      });
      server.clients.forEach(client => {
        if (client.readyState !== WebSocket.OPEN) {
          return;
        }
        client.sendJson();
      });
    } else if (messageObj.type === MessageType.ChatMessageToServer) {
      messageId = nextMessageId++;
      server.clients.forEach(client => {
        if (client.readyState !== WebSocket.OPEN) {
          return;
        }
        client.sendJson({
          ...baseParams(MessageType.ChatMessage),
          text: messageObj.text,
          soo: "baa",
          from: socket.meta.name || "anonymos",
        });
      });
    }
    console.log(`message form user ${socket.meta.id}: ${message}`);
  });
  socket.on("close", function closing(message) {
    server.clients.forEach(client => {
      if (client.readyState !== WebSocket.OPEN) {
        return;
      }
      client.sendJson({
        ...baseParams(MessageType.Info),
        text: "machine disconnected",
      });
    });
  });

  /*server.clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) {
      return;
    }
    client.sendJson({
      ...baseParams(MessageType.Info),
      text: "machine connected",
    });
  });*/
});

console.log("listening for incoming connections");

insideTheConsoleTry = () => {
  // start the server first of course
  // go to localhost:8080 and ignore the text displayed
  socket = new WebSocket("ws://localhost:8080");
  socket.send("well hello there");
  socket.onmessage = message => console.log(message);
  socket.send("hello again");
};
