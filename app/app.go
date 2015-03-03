package main

import (
	"./api"
	"./page"
	"github.com/kere/gos"
	_ "github.com/lib/pq"
)

func main() {
	gos.Init()

	gos.Route("/", &page.Index{})
	gos.RegRoute("^/drawing/.+", &page.Index{})

	// open api router
	gos.WebApiRoute("web", &api.Public{})
	gos.WebApiRoute("open", &api.OpenApi{})

	gos.Start()
}
