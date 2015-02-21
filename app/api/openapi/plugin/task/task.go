package task

import (
	"../../../lib/auth"
	"encoding/json"
	"github.com/kere/gos/lib/log"
	"time"
)

const (
	ACTION_REPORT   = 3
	ACTION_QUESTION = 2
	ACTION_MESSAGE  = 1

	STATUS_OK    = 1
	STATUS_WARN  = 2
	STATUS_ERROR = 3
)

type TaskItemActionMessageVO struct {
	Message string       `json:"message"`
	User    *auth.UserVO `json:"user"`
	Created int64        `json:"created_time"`
}

type TaskItemActionReportVO struct {
	Title   string       `json:"title"`
	User    *auth.UserVO `json:"user"`
	Created int64        `json:"created_time"`
}

func NewTaskItemActionReportVO(title string, u *auth.UserVO) *TaskItemActionReportVO {
	return &TaskItemActionReportVO{
		Title:   title,
		User:    u,
		Created: time.Now().Unix(),
	}
}
