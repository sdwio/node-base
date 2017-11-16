// content of index.js

const WebSocket = require('ws');

const port = 8080

const server = new WebSocket.Server({ port });

console.log('Broadcasting WebSocket server started on port %i', port)

server.on('connection', function connection(socket) {
  console.log('connection established')
  socket.on('message', function incoming(message) {
    /// socket.send(`received: ${message}`);
    server.clients.forEach(client => {
      if (client.readyState !== WebSocket.OPEN) { return; }
      client.send(`new message: ${message}`)
    })
    console.log('received: %s', message);
});
  server.clients.forEach(client => {
    if (client.readyState !== WebSocket.OPEN) { return; }
    client.send(`new machine connected`)
  })
});

console.log('listening for incoming connections')

insideTheConsoleTry = () => {
    // start the server first of course
    // go to localhost:8080 and ignore the text displayed
    socket = new WebSocket('ws://localhost:8080');
    socket.send('well hello there');
    socket.onmessage = message => console.log(message);
    socket.send('hello again');
}
