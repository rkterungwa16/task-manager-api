import { createAppLogger } from "../../middlewares";

export const socketSetup = (webSocketServer: any) => {
    webSocketServer.on('request', (request: any) => {
        const connection = request.accept("", request.origin);
        createAppLogger("Task Manager websocket startup").log({
            level: "info",
            message: `${new Date()} Connection from origin ${request.origin}`
        });

        connection.on('message', (message: any) => {
            if (message.type === 'utf8') {
                // process WebSocket message
            }
        });

        connection.on('close', () => {
            // close user connection
        });
    });
}

