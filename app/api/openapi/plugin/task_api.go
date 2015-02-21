package plugin

import (
	"../../../lib/auth"
	"../../../model/event"
	"../../../model/plugin/task"
	"fmt"
	"github.com/kere/gos"
	"github.com/kere/gos/lib/util"
	// "time"
)

type TaskApi struct {
	gos.WebApi
	auth *auth.UserAuth
}

func (a *TaskApi) Init() bool {
	a.auth = auth.New(a.WebApi.Ctx)
	a.SetUserAuth(a.auth)
	// time.Sleep(time.Duration(int64(1) * 1e9))
	return a.CheckAuth()
}

func (a *TaskApi) userVO() *auth.UserVO {
	return a.auth.GetUserVO()
}

func (a *TaskApi) AnswerQuestion(args util.MapData) (int64, error) {
	qApi := NewQuestionApi(a.auth)

	return qApi.AnswerQuestion(args)
}

func (a *TaskApi) EditAnswer(args util.MapData) (bool, error) {
	qApi := NewQuestionApi(a.auth)
	return qApi.EditAnswer(args)
}

func (a *TaskApi) BestAnswer(args util.MapData) (bool, error) {
	qApi := NewQuestionApi(a.auth)
	return qApi.BestAnswer(args)
}

func (a *TaskApi) SaveData(args util.MapData) (util.MapData, error) {
	users := make([][2]int64, 0)
	args.ParseTo("users", &users)

	subscribers := make([][2]int64, 0)
	args.ParseTo("subscribers", &subscribers)

	vo := task.NewTaskVO(a.auth.CookieBranchId(), a.auth.UserId(), users, subscribers, args.GetString("title"), args.GetString("description"), args.GetBool("enable_exp"), args.GetInt("ctb"), args.GetInt64Slice("weekly"), args.GetTime("begin_at"), args.GetTime("end_at"))
	err := vo.Create()
	if err != nil {
		return nil, gos.DoError(err)
	}

	emvo, err := event.New(a.auth.CookieLang(), a.auth.UserId(), a.auth.CookieBranchId(), "taskPlugin.view", vo.Id, append(users, subscribers...), vo)
	if err != nil {
		return nil, gos.DoError(err)
	}

	vo.EventId = emvo.EventId
	err = vo.UpdateEventId()
	if err != nil {
		return nil, gos.DoError(err)
	}

	return util.MapData{}, nil
}

func (a *TaskApi) GetTaskData(args util.MapData) (util.MapData, error) {
	if args.IsNull("item_id") {
		return nil, fmt.Errorf("unexpected parameter, id is null.")
	}

	data, items, err := task.NewTaskModel().TaskData(args.GetInt64("item_id"))
	if err != nil {
		return nil, err
	}

	obj := util.MapData{}
	obj["task"] = data
	obj["task_items"] = items

	return obj, nil
}
