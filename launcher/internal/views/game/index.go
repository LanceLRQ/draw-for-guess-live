package game

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/websocket"
	"draw-for-guess-live/internal/server"
)

func RegisterRoom (app iris.Party) {
	app.Get("/srv", websocket.Handler(newGameWebsocketView()))
	app.Get("/room/create", server.Guess640JwtRequired, createRoom)
	roomApp := app.Party("/room/{rid:string regexp(^\\\\d{4}$)}", server.Guess640JwtRequired)
	{
		roomApp.Get("/join", joinRoom)
		roomApp.Get("/leave", leaveRoom)
		roomApp.Get("/destroy", destroyRoom)
		roomApp.Get("/kick", kickPeople)
	}
}
