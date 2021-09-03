package game

import (
	"fmt"
	gorilla "github.com/gorilla/websocket"
	"github.com/kataras/iris/v12/websocket"
	"github.com/kataras/neffos"
	neffosGorilla "github.com/kataras/neffos/gorilla"
	"log"
	"net/http"
)

func newGameWebsocketView() *neffos.Server {
	ws := websocket.New(neffosGorilla.Upgrader(gorilla.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}), websocket.Namespaces{
		"drawing": neffos.Events{
			"chat": func(c *neffos.NSConn, msg neffos.Message) error {
				body := string(msg.Body)
				fmt.Println("receive:"  + body + "; name space:" + msg.Namespace + ";room: " + msg.Room)
				if !c.Conn.IsClient() {
					c.Conn.Server().Broadcast(c, msg)
					//c.Room("123").NSConn.Conn.Server().Broadcast(c, msg)
				}
				return nil
			},
			"_OnRoomJoin": func(conn *neffos.NSConn, message neffos.Message) error {
				return nil
			},
		},
	})

	ws.OnConnect = func(c *websocket.Conn) error {
		log.Printf("[%s] Connected to server!", c.ID())
		return nil
	}
	ws.OnDisconnect = func(c *websocket.Conn) {
		log.Printf("[%s] Disconnected from server", c.ID())
	}
	return ws
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