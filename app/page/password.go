package page

import (
	"github.com/jiorry/dswork/app/page/common"

	"github.com/jiorry/dswork/app/lib/auth"
	"github.com/kere/gos"
)

type Password struct {
	gos.Page
}

func (p *Password) Prepare() bool {
	common.SetupPage(&p.Page)

	au := p.GetUserAuth().(*auth.UserAuth)
	user := au.QueryByBindIp()
	if user.Empty() {
		p.Ctx.Redirect("/error/b")
		return false
	}

	p.AddHead("<base href=\"/\">")

	return true
}
