package page

import (
	"./common"
	"github.com/kere/gos"
)

type Index struct {
	gos.Page
}

func (p *Index) Prepare() bool {
	p.Title = "航天科技"
	p.View.Folder = "main"
	common.SetupPage(&p.Page)

	p.AddHead("<base href=\"/\">")
	return true
}
