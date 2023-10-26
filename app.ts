const NODE_ENV = process.env.NODE_ENV ?? "development";

let onlinePlayers: Record<string, string>[] = [];
const chatGroup = "lobby";

const server = Bun.serve<{ username: string; playerName: string }>({
  fetch(req, server) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const playerName = searchParams.get("playername");
    const success = server.upgrade(req, { data: { username, playerName } });

    if (success) return undefined;

    return new Response("onlinerikken.nl websocket server");
  },
  websocket: {
    publishToSelf: true,
    open(ws) {
      ws.subscribe(chatGroup);

      const msg = `${ws.data.playerName} (${ws.data.username}) komt de chat binnen`;

      ws.publish(chatGroup, msg);

      // console.log(`[${NODE_ENV}] ${msg}`);

      onlinePlayers.push({
        playerName: ws.data.playerName,
        username: ws.data.username,
      });
    },
    message(ws, message) {
      // the server re-broadcasts incoming messages to everyone

      const chatMessage = `${ws.data.playerName} (${ws.data.username}): ${message}`;

      ws.publish(chatGroup, chatMessage);

      // Log if the message is not a ping heartbeat
      if (message !== "ping") {
        console.log(`[${NODE_ENV}] ${chatMessage}`);
      }

      ws.publish(
        chatGroup,
        `Online players (${onlinePlayers.length}): ${onlinePlayers
          .map((player) => `${player.playerName} (${player.username})`)
          .join(", ")}`
      );
    },
    close(ws) {
      const msg = `${ws.data.playerName} (${ws.data.username}) heeft de chat verlaten`;

      ws.publish(chatGroup, msg);

      // console.log(`[${NODE_ENV}] ${msg}`);

      ws.unsubscribe(chatGroup);

      onlinePlayers = onlinePlayers.filter(
        (player) => player.username !== ws.data.username
      );
    },
  },
});

console.log(`[${NODE_ENV}] Listening on ${server.hostname}:${server.port}`);
