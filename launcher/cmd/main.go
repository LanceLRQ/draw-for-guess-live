package main

import (
	"github.com/urfave/cli/v2"
	"draw-for-guess-live/internal"
	"log"
	"os"
)

func main () {
	app := &cli.App{
		Name: "Draw For Guess Server",
		Usage: "Start a game server!",
		Flags: []cli.Flag {
			&cli.StringFlag{
				Name: "config",
				Aliases: []string { "c" },
				Value: "./configs/server.yml",
				Usage: "server config file",
			},
			&cli.StringFlag{
				Name: "listen",
				Aliases: []string { "l" },
				Value: "127.0.0.1:8460",
				Usage: "listen address",
			},
		},
		Action: func(context *cli.Context) error {
			return internal.RunServer(context.String("config"), context.String("listen"))
		},
		Commands: []*cli.Command{

		},
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
