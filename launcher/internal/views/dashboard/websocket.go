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



func redirectOnlyHandler(actionType string) func (c *neffos.NSConn, msg neffos.Message) error {
	return func(c *neffos.NSConn, msg neffos.Message) error {
		if !c.Conn.IsClient() {
			c.Conn.Server().Broadcast(c, msg)
		}
		server.GameStatus.DrawingHistory = append(server.GameStatus.DrawingHistory, data.DrawingOperation{
			Type: actionType,
			Msg: string(msg.Body),
		})
		return nil
	}
}

func newGameWebsocketView() *neffos.Server {
	server.DrawingWebSocketServer = websocket.New(neffosGorilla.Upgrader(gorilla.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}), websocket.Namespaces{
		"drawing": neffos.Events{
			"draw": redirectOnlyHandler("draw"),
			"clear": redirectOnlyHandler("clear"),
			"undo": redirectOnlyHandler("undo"),
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