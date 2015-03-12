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
	gos.RegRoute("^/me/.+", &page.Index{})
	gos.Route("/error/:id", &page.Error{})
	gos.Route("/password", &page.Password{})

	// open api router
	gos.WebApiRoute("open", &api.OpenApi{})

	// ssdb.Init(gos.Configuration.GetConf("ssdb"))

	gos.Start()
}
