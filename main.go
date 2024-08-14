package main

import (
	"log"
	"net"

	"chat/pkg/chat"
	pb "chat/protos"

	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc"
)

const (
	redisAddr    = "localhost:6379"
	redisChannel = "chat_channel"
)

func main() {
	// Set up Redis client
	rdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	chatService := chat.NewChatService(rdb)
	s := grpc.NewServer()
	pb.RegisterChatServiceServer(s, chatService)

	log.Printf("Server is running on port :50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
