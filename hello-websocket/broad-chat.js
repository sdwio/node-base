// content of index.js

const WebSocket = require("ws");

const port = 8080;

const server = new WebSocket.Server({ port });

const sendJson = socket => messageObject =>
  socket.send(JSON.stringify(messageObject));

MessageType = {
  RequestName: "RequestName",
  SendName: "SendName",
  Info: "Info",
  ChatMessage: "ChatMessage",
  ChatMessageToServer: "ChatMessageToServer",
  ClientNames: "ClientNames",
};

const preBroadcast = server => (messageType, messageObject) => {
  server.clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) {
      return;
    }
    client.sendJson({
      ...baseParams(messageType),
      ...messageObject,
    });
  });
};
const broadcast = preBroadcast(server);

const getNames = clients =>
  clients.reduce((names, client) => {
    if (
      !client.meta ||
      !client.meta.name ||
      client.readyState !== WebSocket.OPEN
    ) {
      return names;
    }
    names.push(client.meta.name);
    return names;
  }, []);

const broadcastParticipants = (server => () => {
  const participants = getNames([...server.clients]);
  console.log("ALL PARTICIPANTS: " + participants);
  broadcast(MessageType.ClientNames, { clientNames: participants });
})(server);

let nextUserId = 0;
let nextMessageId = 0;

const baseParams = type => ({
  id: nextMessageId++,
  type: type,
  timestamp: Date.now(),
});

console.log("Broadcasting WebSocket server started on port %i", port);

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
      console.log("NEW PARTICIPANT " + socket.meta.name);
      broadcastParticipants();
      broadcast(MessageType.Info, { text: socket.meta.name + " connected" });
    } else if (messageObj.type === MessageType.ChatMessageToServer) {
      messageId = nextMessageId++;
      broadcast(MessageType.ChatMessage, {
        text: messageObj.text,
        soo: "baa",
        from: socket.meta.name || "anonymos",
      });
    }
    console.log(`message form user ${socket.meta.id}: ${message}`);
  });
  socket.on("close", function closing(message) {
    console.log("connection closed");
    broadcastParticipants();
    broadcast(MessageType.Info, {
      text: socket.meta.name + " disconnected",
    });
  });
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
