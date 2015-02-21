package module

import (
	"../../../lib/auth"
	"../../../model/event"
	"fmt"
	"github.com/kere/gos"
	"github.com/kere/gos/lib/util"
)

type HomeApi struct {
	gos.WebApi
}

func (a *HomeApi) EventGroups() (util.MapData, error) {
	au := a.GetUserAuth().(*auth.UserAuth)
	r, err := event.SsdbGetEventGroupUserData(au.CookieLang(), au.UserId())
	if err != nil {
		return nil, err
	}

	result := util.MapData{}
	result["data"] = r

	return result, nil
}

func (a *HomeApi) EventMessages(args util.MapData) ([]*event.EventGroupUserDataVO, error) {
	au := a.GetUserAuth().(*auth.UserAuth)
	r, err := event.SsdbGetEventGroupUserData(au.CookieLang(), au.UserId())
	if err != nil {
		return nil, err
	}
	return r, nil
}

func (h *HomeApi) CallTest(args util.MapData) {
	fmt.Println("CallTest")
	event.SendEventTag(1, nil)
}
