/// <reference types="socket.io" />
import { User } from '../user/types/User.type';
import { ChatService } from './chat.service';
import { Message } from './types/Message.type';
import Socket = SocketIO.Socket;
export declare class ChatGateway {
    private chatService;
    socket: Socket;
    constructor(chatService: ChatService);
    afterInit(server: any): void;
    handleConnection(socket: any): void;
    handleDisconnect(socket: any): void;
    handleGetAddMessage(sender: any, message: Message): void;
    handleIsWriting(sender: any, user: User): void;
    handleIsNotWriting(sender: any): void;
}
