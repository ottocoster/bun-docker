const NODE_ENV = process.env.NODE_ENV ?? "development";

let onlinePlayers: string[] = [];
let requestIP: string | undefined;

const server = Bun.serve<{ username: string }>({
  fetch(req, server) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const success = server.upgrade(req, { data: { username } });
    if (success) return undefined;

    return new Response("Hello rikken");
  },
  websocket: {
    open(ws) {
      ws.subscribe("the-group-chat");
      const msg = `${ws.data.username} has entered the chat`;
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
      onlinePlayers = onlinePlayers.filter(
        (username) => username !== ws.data.username
      );
    },
  },
});

console.log(`[${NODE_ENV}] Listening on ${server.hostname}:${server.port}`);
