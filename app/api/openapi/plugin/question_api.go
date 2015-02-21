package plugin

import (
	"../../../lib/auth"
	"../../../model/event"
	"../../../model/plugin/question"
	"../../../model/plugin/task"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"
)

type QuestionApi struct {
	gos.WebApi
	au *auth.UserAuth
}

func NewQuestionApi(au *auth.UserAuth) *QuestionApi {
	q := &QuestionApi{}
	q.SetUserAuth(au)
	q.au = au
	return q
}

func (a *QuestionApi) Prepare() bool {
	a.au = auth.New(a.WebApi.Ctx)
	a.SetUserAuth(a.au)
	return a.CheckAuth()
}

func (a *QuestionApi) GetQuestionData(args util.MapData) (db.DataRow, error) {
	id := args.GetInt64("id")
	qModel := question.NewQuestionModel()
	return qModel.QuestionData(id)
}

func (a *QuestionApi) Save(args util.MapData) (*question.QuestionVO, error) {
	fromEventId := args.GetInt64("from_event_id")
	userId := a.au.UserId()

	users := make([][2]int64, 0)
	args.ParseTo("users", &users)

	bid := a.au.CookieBranchId()

	vo := question.NewQuestionVO(fromEventId,
		bid,
		userId,
		users,
		args.GetString("title"),
		args.GetString("question"))

	err := vo.Create()
	if err != nil {
		return nil, gos.DoError(err)
	}

	lang := a.au.CookieLang()
	// new event and push to notice
	emvo, err := event.New(lang, bid, userId, "plugin.question.view", vo.Id, users, vo)
	if err != nil {
		return nil, gos.DoError(err)
	}

	vo.EventId = emvo.EventId
	err = vo.UpdateEventId()
	if err != nil {
		return nil, gos.DoError(err)
	}

	// if question from task,this will create a task question
	qItemModel := task.NewTaskItemModel()
	if err = qItemModel.RelateEventForCreateTaskItem("question", fromEventId, emvo); err != nil {
		return nil, gos.DoError(err)
	}

	return vo, nil
}

func (a *QuestionApi) EditQuestion(args util.MapData) (bool, error) {
	users := make([][2]int64, 0)
	args.ParseTo("users", &users)

	vo := question.NewQuestionVO(0, 0, 0, users, args.GetString("title"), args.GetString("question"))
	vo.Id = args.GetInt64("item_id")
	err := vo.Update()

	return gos.DoError(err) != nil, nil
}

func (a *QuestionApi) AnswerQuestion(args util.MapData) (int64, error) {
	// eventId := args.GetInt64("event_id")
	qid := args.GetInt64("qid")
	answer := args.GetString("answer")

	qModel := question.NewQuestionModel()
	answerVO, err := qModel.AnswerQuestion(qid, a.au.UserId(), answer)
	if err != nil {
		return int64(0), gos.DoError(err)
	}

	qRow, err := qModel.QueryById(qid)
	if qRow.Empty() {
		return int64(0), gos.DoError("AnswerQuestion query empty")
	}
	if err != nil {
		return int64(0), gos.DoError(err)
	}

	lang := a.au.CookieLang()
	t := event.NewEventMessageBuilder(lang, "questionPlugin.view")
	if err = event.UpdateEvents(lang, t.BuildText("answer", a.au.Nick()), qRow.GetInt64("event_id"), qRow.GetInt64("from_event_id")); err != nil {
		return int64(0), gos.DoError(err)
	}

	return answerVO.Id, nil
}

func (a *QuestionApi) EditAnswer(args util.MapData) (bool, error) {
	answerId := args.GetInt64("answer_id")
	answer := args.GetString("answer")

	qModel := question.NewQuestionModel()
	err := qModel.EditAnswer(answerId, answer)
	return true, gos.DoError(err)
}

func (a *QuestionApi) BestAnswer(args util.MapData) (bool, error) {
	eventId := args.GetInt64("event_id")
	itemId := args.GetInt64("answer_id")
	isBest := args.GetBool("is_best")

	qModel := question.NewQuestionModel()
	err := qModel.BestAnswer(itemId, isBest)
	if err != nil {
		return false, gos.DoError(err)
	}
	lang := a.au.CookieLang()
	t := event.NewEventMessageBuilder(lang, "questionPlugin.view")
	if err = event.Update(eventId, lang, t.BuildText("best", a.au.Nick())); err != nil {
		return false, gos.DoError(err)
	}
	return true, nil
}
