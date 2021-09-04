package dashboard

import (
	gorilla "github.com/gorilla/websocket"
	"github.com/kataras/iris/v12/websocket"
	"github.com/kataras/neffos"
	neffosGorilla "github.com/kataras/neffos/gorilla"
	"log"
	"net/http"
)

var DrawingWebSocketServer *neffos.Server = nil

func redirectOnlyHandler(c *neffos.NSConn, msg neffos.Message) error {
	if !c.Conn.IsClient() {
		c.Conn.Server().Broadcast(c, msg)
	}
	return nil
}

func newGameWebsocketView() *neffos.Server {
	DrawingWebSocketServer = websocket.New(neffosGorilla.Upgrader(gorilla.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}), websocket.Namespaces{
		"drawing": neffos.Events{
			"draw": redirectOnlyHandler,
			"clear": redirectOnlyHandler,
			"undo": redirectOnlyHandler,
			"_OnRoomJoin": func(conn *neffos.NSConn, message neffos.Message) error {
				return nil
			},
		},
	})

	DrawingWebSocketServer.OnConnect = func(c *websocket.Conn) error {
		log.Printf("[%s] Connected to server!", c.ID())
		return nil
	}
	DrawingWebSocketServer.OnDisconnect = func(c *websocket.Conn) {
		log.Printf("[%s] Disconnected from server", c.ID())
	}

	return DrawingWebSocketServer
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