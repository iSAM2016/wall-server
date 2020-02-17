// import {
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   OnGatewayInit,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import * as redis from 'redis';
// import * as socketIoRedis from 'socket.io-redis';
// import { Logger, UseFilters } from '@nestjs/common';
// import { ConfigService } from './core/configure/config.service';

// @WebSocketGateway()
// // @UseFilters(new WebsocketsExceptionFilter())
// export class ApplicationGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
//   private logger = new Logger('AppGateway');
//   @WebSocketServer() public readonly io: SocketIO.Server;

//   async afterInit(io: SocketIO.Server) {
//     const options: redis.ClientOpts = {
//       host: String(ConfigService.get('REDIS_HOST')),
//       port: +ConfigService.get('REDIS_PORT') || 6379,
//       password: '' || undefined,
//       db: 0,
//     };
//     const pubClient = redis.createClient(options);
//     const subClient = redis.createClient(options);
//     io.adapter(socketIoRedis({ pubClient, subClient }));
//   }

//   async handleConnection(socket: SocketIO.Socket) {
//     this.logger.log(`Socket ID: ${socket.id} connected!`);
//   }

//   async handleDisconnect(socket: SocketIO.Socket) {
//     this.logger.log(`Socket ID: ${socket.id} disconnected!`);
//   }

//   @SubscribeMessage('WELCOME')
//   async onWelcome(socket: SocketIO.Socket, data: any) {
//     this.io.emit('WELCOME', `Welcome ${socket.id}.`);
//   }
// }
