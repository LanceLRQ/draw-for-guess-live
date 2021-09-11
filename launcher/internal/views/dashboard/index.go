package dashboard

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/websocket"
)

func RegisterRoom (app iris.Party) {
	app.Get("/service", websocket.Handler(newGameWebsocketView()))
	app.Get("/game_status", GetGameStatus)
	app.Get("/riddle/list", GetRiddleList)
	app.Post("/riddle/add", AddRiddle)
	app.Post("/riddle/edit", EditRiddle)
	app.Post("/riddle/del", DeleteRiddle)
	app.Post("/game/change_riddle", GameChangeRiddle)
	//app.Get("/room/create", server.Guess640JwtRequired, createRoom)
}
