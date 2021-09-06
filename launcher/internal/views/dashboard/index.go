package dashboard

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/websocket"
)

func RegisterRoom (app iris.Party) {
	app.Get("/service", websocket.Handler(newGameWebsocketView()))
	app.Get("/game_status", GetGameStatus)
	//app.Get("/room/create", server.Guess640JwtRequired, createRoom)
}
