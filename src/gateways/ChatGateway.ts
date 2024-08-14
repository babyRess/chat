import BaseGateway from './BaseGateway';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../protos/chat';
import { Server, Socket } from 'socket.io';
import RedisPubSub from '../redis/RedisPubSub';
import { ChatServiceClient } from '../protos/chat/ChatService';
class ChatGateway extends BaseGateway {
  private redisPubSub: RedisPubSub;
  private client: ChatServiceClient;

  constructor() {
    super();
    // Initialize Redis Pub/Sub
    this.redisPubSub = new RedisPubSub();
  }

  public async Setup(): Promise<void> {
    // Connect to Redis
    await this.redisPubSub.connect();

    return new Promise((resolve, reject) => {
      // Load the gRPC service definition
      const packageDefinition = protoLoader.loadSync('protos/chat.proto');
      const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
      // Initialize the gRPC client
      this.client = new proto.chat.ChatService(this.host, grpc.credentials.createInsecure());
      resolve();
    });
  }

  /**
   * Register event handlers for a specific socket client.
   * @param {Socket} socketClient - The socket client instance.
   */
  public RegisterGateway(socketClient: Socket) {
    // Register the 'sendMessage' event handler
    this.registerSocketEvent(socketClient, 'sendMessage', this.client.sendMessage.bind(this.client));

    // Register the 'joinRoom' event handler
    this.registerSocketEvent(socketClient, 'joinRoom', (params: any) => this.handleJoinRoom(socketClient, this.client, params));
  }

  /**
   * Register Redis Pub/Sub event handling on the socket server.
   * @param {Server} socketServer - The socket server instance.
   */
  public RegisterSocket(socketServer: Server) {
    // Subscribe to the 'chat_channel' on Redis and handle incoming messages
    this.redisPubSub.subscribe('chat_channel', (message: string) => this.handlerRedisMessage(socketServer, message));
  }

  private handlerRedisMessage(socketServer: Server, data: string) {
    console.log('Broadcasting message to room:', data);

    try {
      const parsedMessage = JSON.parse(data);
      const { roomId, message } = parsedMessage;

      // Broadcast message to the specified room
      socketServer.to(roomId).emit('chatMessage', message);
    } catch (error) {
      console.error('Error handling Redis message:', error);
    }
  }

  private handleJoinRoom(socketClient: Socket, client: ChatServiceClient, params: any) {
    const request = {
      userId: params.userId,
      roomId: params.roomId,
    };
    console.log('Join room request:', request);

    // Call the gRPC service to join the room
    client.joinRoom(request, (err: any, response: any) => {
      if (err) {
        console.error('Error joining room:', err);
        return;
      }
      if (response?.success) {
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
