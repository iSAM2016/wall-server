import { Message } from './types/Message.type';
import { Injectable } from '@nestjs/common';
@Injectable()
export class ChatService {
  messages: Message[] = [];

  getMessages(): Message[] {
    return this.messages;
  }

  storeMessage(message: Message) {
    this.messages.push(message);
  }
}
