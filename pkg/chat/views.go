package chat

import "fmt"

func renderChatMessage(roomID string, message string) string {
	return fmt.Sprintf(`{"roomId": "%s", "message": "%s"}`, roomID, message)
}
