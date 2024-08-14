package chat

import (
	pb "chat/protos"
	"context"
	"log"
	"sync"

	"github.com/redis/go-redis/v9"
)

type ChatService struct {
	pb.UnimplementedChatServiceServer
	rooms       map[string][]string // Map of room IDs to a list of user IDs
	mu          sync.Mutex
	redisClient *redis.Client
}

func NewChatService(rdb *redis.Client) *ChatService {
	return &ChatService{
		rooms:       make(map[string][]string),
		redisClient: rdb,
	}
}

func contains(users []string, user string) bool {
	for _, u := range users {
		if u == user {
			return true
		}
	}
	return false
}

func (s *ChatService) SendMessage(ctx context.Context, msg *pb.ChatRequest) (*pb.ChatMessage, error) {
	// Broadcast message to all users in the room
	s.mu.Lock()
	users := s.rooms[msg.RoomId]
	s.mu.Unlock()
	// check if userName is in the room
	if !contains(users, msg.UserId) {
		return &pb.ChatMessage{
			UserId:  msg.UserId,
			Message: "You are not in the room",
		}, nil
	}

	err := s.redisClient.Publish(ctx, "chat_channel", renderChatMessage(msg.RoomId, msg.Message)).Err()
	if err != nil {
		return &pb.ChatMessage{
			UserId:  msg.UserId,
			Message: err.Error(),
		}, err
	}
	log.Printf("Message sent to room %s", msg.RoomId)
	return &pb.ChatMessage{
		UserId:  msg.UserId,
		Message: msg.GetMessage(),
	}, nil
}

func (s *ChatService) JoinRoom(ctx context.Context, req *pb.JoinChatRoomRequest) (*pb.JoinRoomResponse, error) {

	s.mu.Lock()
	defer s.mu.Unlock()

	// check input room ID
	if req.RoomId == "" {
		return &pb.JoinRoomResponse{
			Success: false,
			Message: "Room ID cannot be empty",
		}, nil
	}
	// Add user to the room
	s.rooms[req.RoomId] = append(s.rooms[req.RoomId], req.UserId)

	log.Printf("User %s joined room %s", req.UserId, req.RoomId)
	// send pubsub message to all users in the room
	err := s.redisClient.Publish(ctx, "chat_channel", renderChatMessage(req.RoomId, req.UserId+" joined the room")).Err()
	if err != nil {
		log.Printf("Error publishing message to Redis: %v", err)
		return &pb.JoinRoomResponse{
			Success: false,
			Message: err.Error(),
		}, err
	}

	return &pb.JoinRoomResponse{
		Success: true,
		Message: "Joined room successfully",
	}, nil
}
