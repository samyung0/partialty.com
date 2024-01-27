const socket = new WebSocket("wss://api.partialty.com/mux/ws");

socket.addEventListener("open", () => {
  console.log("Connected to the server");

  socket.send("Hello from the client");
});

socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});
