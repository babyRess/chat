// Original file: protos/chat.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ChatMessage as _chat_ChatMessage, ChatMessage__Output as _chat_ChatMessage__Output } from '../chat/ChatMessage';
import type { ChatRequest as _chat_ChatRequest, ChatRequest__Output as _chat_ChatRequest__Output } from '../chat/ChatRequest';
import type { JoinChatRoomRequest as _chat_JoinChatRoomRequest, JoinChatRoomRequest__Output as _chat_JoinChatRoomRequest__Output } from '../chat/JoinChatRoomRequest';
import type { JoinRoomResponse as _chat_JoinRoomResponse, JoinRoomResponse__Output as _chat_JoinRoomResponse__Output } from '../chat/JoinRoomResponse';

export interface ChatServiceClient extends grpc.Client {
  JoinRoom(argument: _chat_JoinChatRoomRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_JoinRoomResponse__Output>): grpc.ClientUnaryCall;
  JoinRoom(argument: _chat_JoinChatRoomRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_chat_JoinRoomResponse__Output>): grpc.ClientUnaryCall;
  JoinRoom(argument: _chat_JoinChatRoomRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_JoinRoomResponse__Output>): grpc.ClientUnaryCall;
  JoinRoom(argument: _chat_JoinChatRoomRequest, callback: grpc.requestCallback<_chat_JoinRoomResponse__Output>): grpc.ClientUnaryCall;
  joinRoom(argument: _chat_JoinChatRoomRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_JoinRoomResponse__Output>): grpc.ClientUnaryCall;
  joinRoom(argument: _chat_JoinChatRoomRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_chat_JoinRoomResponse__Output>): grpc.ClientUnaryCall;
  joinRoom(argument: _chat_JoinChatRoomRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_JoinRoomResponse__Output>): grpc.ClientUnaryCall;
  joinRoom(argument: _chat_JoinChatRoomRequest, callback: grpc.requestCallback<_chat_JoinRoomResponse__Output>): grpc.ClientUnaryCall;
  
  SendMessage(argument: _chat_ChatRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_ChatMessage__Output>): grpc.ClientUnaryCall;
  SendMessage(argument: _chat_ChatRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_chat_ChatMessage__Output>): grpc.ClientUnaryCall;
  SendMessage(argument: _chat_ChatRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_ChatMessage__Output>): grpc.ClientUnaryCall;
  SendMessage(argument: _chat_ChatRequest, callback: grpc.requestCallback<_chat_ChatMessage__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _chat_ChatRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_ChatMessage__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _chat_ChatRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_chat_ChatMessage__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _chat_ChatRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_chat_ChatMessage__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _chat_ChatRequest, callback: grpc.requestCallback<_chat_ChatMessage__Output>): grpc.ClientUnaryCall;
  
}

export interface ChatServiceHandlers extends grpc.UntypedServiceImplementation {
  JoinRoom: grpc.handleUnaryCall<_chat_JoinChatRoomRequest__Output, _chat_JoinRoomResponse>;
  
  SendMessage: grpc.handleUnaryCall<_chat_ChatRequest__Output, _chat_ChatMessage>;
  
}

export interface ChatServiceDefinition extends grpc.ServiceDefinition {
  JoinRoom: MethodDefinition<_chat_JoinChatRoomRequest, _chat_JoinRoomResponse, _chat_JoinChatRoomRequest__Output, _chat_JoinRoomResponse__Output>
  SendMessage: MethodDefinition<_chat_ChatRequest, _chat_ChatMessage, _chat_ChatRequest__Output, _chat_ChatMessage__Output>
}
