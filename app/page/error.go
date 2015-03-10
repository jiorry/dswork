package page

import (
	"./common"
	"github.com/kere/gos"
)

type Error struct {
	gos.Page
}

func (p *Error) Prepare() bool {
	p.Title = "航天工程"
	common.SetupPage(&p.Page)

	// p.AddHead(`<style type="text/css">body{background-image:url("/assets/img/error-bk.jpg")}</style>`)

	p.AddHead("<base href=\"/\">")
	return true
}
