package project

import (
	"github.com/kere/gos/db"
)

type ProjectVO struct {
	db.BaseVO
	Id     int64  `json:"id" skip:"all"`
	Name   string `json:"name"`
	Status int    `json:"status"`
}

func NewProjectVO(name string) *ProjectVO {
	vo := &ProjectVO{
		Name:   name,
		Status: 0,
	}

	vo.Init(vo)
	return vo
}

func (a *ProjectVO) Table() string {
	return "projects"
}
