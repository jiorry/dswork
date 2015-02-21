package plugin

import (
	"../../../lib/auth"
	"../../../model/event"
	"../../../model/plugin/apply"
	"../../../model/plugin/task"
	"fmt"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"
	// "time"
)

type ApplyApi struct {
	gos.WebApi
	auth *auth.UserAuth
}

func (a *ApplyApi) Init() bool {
	a.auth = auth.New(a.WebApi.Ctx)
	a.SetUserAuth(a.auth)
	return a.CheckAuth()
}

func (a *ApplyApi) CreateApply(args util.MapData) (int64, error) {
	fromEventId := args.GetInt64("from_event_id")
	userId := a.auth.UserId()
	bid := a.auth.CookieBranchId()
	title := args.GetString("title")
	formName := args.GetString("form_name")
	data := args.GetMapData("formdata")

	approver := make([][2]int64, 0)
	data.ParseTo("approver", &approver)

	applyModel := apply.NewApplyModel()
	vo, err := applyModel.CreateApply(bid, fromEventId, userId, formName, approver, data)
	if err != nil {
		return 0, gos.DoError(err)
	}

	lang := a.auth.CookieLang()
	// new event and push to notice
	emvo, err := event.NewEventWithMessage(bid, userId, "applyPlugin.view", vo.Id, approver, vo, lang, title)
	if err != nil {
		return 0, gos.DoError(err)
	}

	vo.EventId = emvo.EventId
	err = vo.UpdateEventId()
	if err != nil {
		return 0, gos.DoError(err)
	}

	// if question from task,this will create a task question
	qItemModel := task.NewTaskItemModel()
	if err = qItemModel.RelateEventForCreateTaskItem("apply", fromEventId, emvo); err != nil {
		return 0, gos.DoError(err)
	}

	return vo.Id, nil
}

func (a *ApplyApi) UpdateApply(args util.MapData) (bool, error) {
	return true, nil
}

func (a *ApplyApi) ApplyData(args util.MapData) (db.DataRow, error) {
	if args.IsNull("id") {
		return nil, fmt.Errorf("unexpected parameter, id is null.")
	}

	return apply.NewApplyModel().ApplyData(args.GetInt64("id"))
}
