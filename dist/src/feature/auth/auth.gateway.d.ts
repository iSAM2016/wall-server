/// <reference types="socket.io" />
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
export declare class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger;
    private readonly io;
    handleConnection(socket: SocketIO.Socket): Promise<void>;
    handleDisconnect(socket: SocketIO.Socket): Promise<void>;
    onWelcome(socket: SocketIO.Socket, data: any): Promise<void>;
}
