package site

import (
	"../../../lib/auth"
	"../../../model/appdata"
	"../../../model/drawing"
	"../../../model/project"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"
)

type PasswordPrivate struct {
	gos.WebApi
}

func (p *PasswordPrivate) Prepare() {
	if a.GetUserAuth().IsOk() {
		return true
	} else {
		gos.NewError(0, "login failed").Write(a.Ctx.ResponseWriter)
		return false
	}
}

func (p *PasswordPrivate) AppData() (util.MapData, error) {

}
