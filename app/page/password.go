package page

import (
	"./common"
	"github.com/kere/gos"
)

type Password struct {
	gos.Page
}

func (p *Password) Prepare() bool {
	common.SetupPage(&p.Page)

	p.AddHead("<base href=\"/\">")
	return true
}
