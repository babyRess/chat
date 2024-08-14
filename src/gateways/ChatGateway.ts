// import BaseGateway from './BaseGateway';
// import * as grpc from '@grpc/grpc-js';
// import * as protoLoader from '@grpc/proto-loader';
// import { ProtoGrpcType } from '../protos/chat';
// import { Server, Socket } from 'socket.io';
// import RedisPubSub from '../redis/RedisPubSub';

// class ChatGateway extends BaseGateway {
//   private proto: ProtoGrpcType;
//   private redisPubSub: RedisPubSub;

//   constructor() {
//     super();
//     this.redisPubSub = new RedisPubSub();
//   }

//   public async Setup(): Promise<void> {
//     return new Promise<void>((resolve, reject) => {
//       const packageDefinition = protoLoader.loadSync('protos/chat.proto');
//       this.proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
//       // Connect to Redis
//       this.redisPubSub.connect().then(resolve).catch(reject);
//       resolve(null);
//     });
//   }

//   public RegisterGateway(socketClient: Socket) {
//     const client = new this.proto.chat.ChatService(this.host, grpc.credentials.createInsecure());
//     this.registerSocketEvent(socketClient, 'sendMessage', client.sendMessage.bind(client));
//     this.registerSocketEvent(socketClient, 'joinRoom', this.handleJoinRoom.bind(this, socketClient, client));
//   }

//   public RegisterSocket(socketClient: Socket) {
//     this.registerRedisEvent(socketClient);
//   }

//   // register redis event
//   public registerRedisEvent(socketClient: Socket) {
//     this.redisPubSub.subscribe('chat_channel', (message: string) => this.handlerRedisMessage(socketClient, message));
//   }

//   // handle redis message
//   private handlerRedisMessage(socketClient: Socket, message: string) {
//     const parsedMessage = JSON.parse(message);
//     const { roomId, data } = parsedMessage;
//     // boardcast message to room
//     console.error('broadcasting message to room:', roomId);

//     socketClient.to(roomId).emit('chatMessage', data);
//   }

//   private handleJoinRoom(socketClient: Socket, client: any, params: any) {
//     const request = {
//       userName: params.userName,
//       roomId: params.roomId,
//     };

//     client.joinRoom(request, (err: any, response: any) => {
//       if (response && response.success) {
//         socketClient.join(request.roomId);
//       } else {
//         console.error('Failed to join room:', response?.message);
//       }
//     });
//   }
// }

// export default ChatGateway;

import BaseGateway from './BaseGateway';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../protos/chat';
import { Server, Socket } from 'socket.io';
import RedisPubSub from '../redis/RedisPubSub';
import { ChatServiceClient } from '../protos/chat/ChatService';

class ChatGateway extends BaseGateway {
  // private proto: ProtoGrpcType;
  private redisPubSub: RedisPubSub;

  private client: ChatServiceClient;

  constructor() {
    super();
    this.redisPubSub = new RedisPubSub();
  }

  // public async Setup(): Promise<void> {
  //   try {
  //     const packageDefinition = protoLoader.loadSync('protos/chat.proto');
  //     this.proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

  //     // Connect to Redis
  //     await this.redisPubSub.connect();
  //     resolve(null);
  //   } catch (error) {
  //     console.error('Setup error:', error);
  //     throw error;
  //   }
  // }

  public async Setup() {
    await this.redisPubSub.connect();

    return new Promise((resolve, reject) => {
      const packageDefinition = protoLoader.loadSync('protos/chat.proto');
      const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
      this.client = new proto.chat.ChatService(this.host, grpc.credentials.createInsecure());
      resolve(null);
    });
  }
  public RegisterGateway(socketClient: Socket) {
    // const client = new this.proto.chat.ChatService(this.host, grpc.credentials.createInsecure());

    // Register event handlers
    this.registerSocketEvent(socketClient, 'sendMessage', this.client.sendMessage.bind(this.client));
    this.registerSocketEvent(socketClient, 'joinRoom', (params: any) => this.handleJoinRoom(socketClient, this.client, params));
  }

  public RegisterSocket(socketServer: Server) {
    this.redisPubSub.subscribe('chat_channel', (message: string) => this.handlerRedisMessage(socketServer, message));
  }

  // Handle Redis message
  private handlerRedisMessage(socketServer: Server, data: string) {
    console.error('Broadcasting message to room:', data);

    try {
      const parsedMessage = JSON.parse(data);
      const { roomId, message } = parsedMessage;

      // Broadcast message to room
      socketServer.to(roomId).emit('chatMessage', message);
    } catch (error) {
      console.error('Error handling Redis message:', error);
    }
  }

  private handleJoinRoom(socketClient: Socket, client: any, params: any) {
    const request = {
      userId: params.userId,
      roomId: params.roomId,
    };
    console.error('Join room request:', request);
    client.joinRoom(request, (err: any, response: any) => {
      if (err) {
        console.error('Error joining room:', err);
        return;
      }
      response = response || {};
      if (response && response.success) {
        console.log(`User ${request.userId} joined room ${request.roomId}`);
        socketClient.join(request.roomId);
      } else {
        console.error('Failed to join room:', response?.message);
        socketClient.emit('errorJoin', { message: `Failed to join room: ${response?.message}` });
      }
    });
  }
}

export default ChatGateway;
