const NODE_ENV = process.env.NODE_ENV ?? "development";

let onlinePlayers: string[] = [];

const server = Bun.serve<{ username: string }>({
  fetch(req, server) {
    const username = req.headers.get("username");
    const success = server.upgrade(req, { data: { username } });
    if (success) return undefined;

    return new Response("Hello world");
  },
  websocket: {
    open(ws) {
      const msg = `${ws.data.username} has entered the chat`;
      ws.subscribe("the-group-chat");
      ws.publish("the-group-chat", msg);
      onlinePlayers.push(ws.data.username);
    },
    message(ws, message) {
      // the server re-broadcasts incoming messages to everyone
      ws.publish("the-group-chat", `${ws.data.username}: ${message}`);
      ws.publish(
        "the-group-chat",
        `Online players (${onlinePlayers.length}): ${onlinePlayers.join(", ")}`
      );
    },
    close(ws) {
      const msg = `${ws.data.username} has left the chat`;
      ws.publish("the-group-chat", msg);
      ws.unsubscribe("the-group-chat");
    },
  },
});

console.log(`[${NODE_ENV}] Listening on ${server.hostname}:${server.port}`);
