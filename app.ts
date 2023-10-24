const NODE_ENV = process.env.NODE_ENV ?? "development";

let onlinePlayers: Record<string, string>[];
const chatGroup = "the-group-chat";

const server = Bun.serve<{ username: string; playerName: string }>({
  fetch(req, server) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const playerName = searchParams.get("playername");
    const success = server.upgrade(req, { data: { username, playerName } });

    if (success) return undefined;

    return new Response("Hello rikken");
  },
  websocket: {
    open(ws) {
      ws.subscribe(chatGroup);

      const msg = `${ws.data.playerName} (${ws.data.username}) has entered the chat`;

      ws.publish(chatGroup, msg);

      console.log(`[${NODE_ENV}] ${msg}`);

      onlinePlayers.push({
        playerName: ws.data.playerName,
        username: ws.data.username,
      });
    },
    message(ws, message) {
      // the server re-broadcasts incoming messages to everyone
      ws.publish(
        chatGroup,
        `${ws.data.playerName} (${ws.data.username}): ${message}`
      );

      ws.publish(
        chatGroup,
        `Online players (${onlinePlayers.length}): ${onlinePlayers.join(", ")}`
      );
    },
    close(ws) {
      const msg = `${ws.data.playerName} (${ws.data.username}) has left the chat`;

      ws.publish(chatGroup, msg);

      console.log(`[${NODE_ENV}] ${msg}`);

      ws.unsubscribe(chatGroup);

      onlinePlayers = onlinePlayers.filter(
        (player) => player.username !== ws.data.username
      );
    },
  },
});

console.log(`[${NODE_ENV}] Listening on ${server.hostname}:${server.port}`);
