const NODE_ENV = process.env.NODE_ENV ?? "development";

let onlinePlayers: string[] = [];

const server = Bun.serve({
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) return undefined;

    return new Response("Hello world");
  },
  websocket: {
    open(ws) {
      ws.subscribe("the-group-chat");
      const msg = `A new player has entered the chat`;
      ws.publish("the-group-chat", msg);
      onlinePlayers.push("player");
    },
    message(ws, msg) {
      // the server re-broadcasts incoming messages to everyone
      const user = (msg as string).match(/(.*):/)?.[1];
      const message = (msg as string).match(/:(.*)/)?.[1];
      ws.publish("the-group-chat", `${user}: ${message}`);
      ws.publish(
        "the-group-chat",
        `Online players (${onlinePlayers.length}): ${onlinePlayers.join(", ")}`
      );
    },
    close(ws) {
      const msg = `Player has left the chat`;
      ws.publish("the-group-chat", msg);
      ws.unsubscribe("the-group-chat");
    },
  },
});

console.log(`[${NODE_ENV}] Listening on ${server.hostname}:${server.port}`);
