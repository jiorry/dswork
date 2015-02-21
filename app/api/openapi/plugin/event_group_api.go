package plugin

import (
	"../../../lib/auth"
	// "../../lib/myutil"
	"../../../model/event"
	"github.com/kere/gos"
	"github.com/kere/gos/lib/util"
	"time"
)

type EventGroupApi struct {
	gos.WebApi
	au *auth.UserAuth
}

func (a *EventGroupApi) Init() bool {
	a.au = auth.New(a.WebApi.Ctx)
	a.SetUserAuth(a.au)
	time.Sleep(time.Duration(int64(1) * 1e9))
	return a.CheckAuth()
}

func (a *EventGroupApi) EventGroupItems(args util.MapData) (util.MapData, error) {
	page := args.GetInt("page")
	tid := args.GetInt("type_id")

	var lang = a.au.CookieLang()
	var err error
	var viewName = event.GetEventTypeName(tid)
	var result = util.MapData{}

	result["items"], err = event.SsdbGetEventGroupItems(lang, a.au.UserId(), tid, page)
	if err != nil {
		return result, err
	}

	t := event.NewEventMessageBuilder(lang, viewName)

	result["name"] = viewName
	result["icon"] = t.Icon

	return result, err
}
