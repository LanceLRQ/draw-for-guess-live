package dashboard

import (
	gorilla "github.com/gorilla/websocket"
	"github.com/kataras/iris/v12/websocket"
	"github.com/kataras/neffos"
	neffosGorilla "github.com/kataras/neffos/gorilla"
	"launcher/internal/data"
	"launcher/internal/server"
	"log"
	"net/http"
)


func newGameWebsocketView() *neffos.Server {
	server.DrawingWebSocketServer = websocket.New(neffosGorilla.Upgrader(gorilla.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}), websocket.Namespaces{
		"drawing": neffos.Events{
			"draw": func(c *neffos.NSConn, msg neffos.Message) error {
				if !c.Conn.IsClient() {
					c.Conn.Server().Broadcast(c, msg)
				}
				server.GameStatus.DrawingHistory = append(server.GameStatus.DrawingHistory, data.DrawingOperation{
					Type: "draw",
					Msg: string(msg.Body),
				})
				return nil
			},
			"clear": func(c *neffos.NSConn, msg neffos.Message) error {
				if !c.Conn.IsClient() {
					c.Conn.Server().Broadcast(c, msg)
				}
				// clean history
				server.GameStatus.DrawingHistory = []data.DrawingOperation{}
				return nil
			},
			"undo": func(c *neffos.NSConn, msg neffos.Message) error {
				if !c.Conn.IsClient() {
					c.Conn.Server().Broadcast(c, msg)
				}
				server.GameStatus.DrawingHistory = append(server.GameStatus.DrawingHistory, data.DrawingOperation{
					Type: "undo",
					Msg: string(msg.Body),
				})
				return nil
			},
			"_OnRoomJoin": func(conn *neffos.NSConn, message neffos.Message) error {
				return nil
			},
		},
	})

	server.DrawingWebSocketServer.OnConnect = func(c *websocket.Conn) error {
		log.Printf("[%s] Connected to server!", c.ID())
		return nil
	}
	server.DrawingWebSocketServer.OnDisconnect = func(c *websocket.Conn) {
		log.Printf("[%s] Disconnected from server", c.ID())
	}

	return server.DrawingWebSocketServer
}

/*
 websocket.Events{
		websocket.OnNativeMessage: func(nsConn *websocket.NSConn, msg websocket.Message) error {
			log.Printf("Server got: %s from [%s]", msg.Body, nsConn.Conn.ID())

			nsConn.Conn.Server().Broadcast(nsConn, msg)
			return nil
		},
	}
 */