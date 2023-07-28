package main

import (
	"fmt"
	"net/http"

	"bomberman-dom/server"
)

func main() {
	// Définir la route pour le gestionnaire de connexions WebSocket
	http.HandleFunc("/ws", server.HandleWebSocketConnection)

	// Définir le port d'écoute du serveur WebSocket
	port := "8080"

	fmt.Println("Serveur WebSocket démarré sur le port", port)
	// Lancer le serveur en écoutant sur le port spécifié
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Println("Erreur lors du démarrage du serveur:", err)
	}
}
