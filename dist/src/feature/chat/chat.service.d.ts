import { Message } from './types/Message.type';
export declare class ChatService {
    messages: Message[];
    getMessages(): Message[];
    storeMessage(message: Message): void;
}
