import * as WebSocketServer from "websocket";

export const initSocketServer = (server: any) => {
  return new WebSocketServer.server({
    httpServer: server.listen(8000),
    autoAcceptConnections: false
  });
};
