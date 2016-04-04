package page

import (
	"github.com/jiorry/dswork/app/page/common"

	"github.com/kere/gos"
)

type Index struct {
	gos.Page
}

func (p *Index) Prepare() bool {
	common.SetupPage(&p.Page)

	p.Title = "航天工程"

	p.AddHead("<base href=\"/\">")
	return true
}
