package task

import (
	"../../../lib/auth"
	taskM "../../../model/plugin/task"
	"fmt"
	"github.com/kere/gos"
)

func actionQuestionData(taskItemModel *taskM.TaskItemModel, itemId int64) (*TaskItemActionQuestionVO, error) {
	itemData, err := taskItemModel.Query(itemId)
	if err != nil {
		return nil, err
	}

	return JsonToTaskItemActionQuestionVO(itemData.GetBytes("json_data"))
}

func BestAnswer(itemId int64, answerId int, isBest bool) (bool, error) {
	taskItemModel := taskM.NewTaskItemModel()

	actionQuestionData, err := actionQuestionData(taskItemModel, itemId)
	if err != nil {
		return false, err
	}

	if !isBest {
		actionQuestionData.SetBest(0)
		err = taskItemModel.Update(itemId, actionQuestionData, STATUS_WARN)
	} else {
		actionQuestionData.SetBest(answerId)
		err = taskItemModel.Update(itemId, actionQuestionData, STATUS_OK)
	}

	if err != nil {
		return false, err
	}

	return true, nil
}

func AnswerQuestion(itemId int64, answerId int, answer string, u *auth.UserVO) (*QuestionAnswerVO, error) {
	taskItemModel := taskM.NewTaskItemModel()

	actionQuestionData, err := actionQuestionData(taskItemModel, itemId)
	if err != nil {
		return nil, err
	}

	var answerVO *QuestionAnswerVO
	if answerId == 0 {
		answerVO = NewQuestionAnswerVO(actionQuestionData.Seq+1, answer, u)
		actionQuestionData.Add(answerVO)
		actionQuestionData.Seq += 1
	} else {
		answerVO = NewQuestionAnswerVO(answerId, answer, u)
		if !actionQuestionData.Replace(answerVO) {
			return nil, gos.NewError(0, fmt.Sprintf("replace question failed. task_item_id:%d answer_id:%d", itemId, answerId))
		}
	}

	err = taskItemModel.Update(itemId, actionQuestionData, STATUS_WARN)
	if err != nil {
		return nil, err
	}

	return answerVO, nil
}
