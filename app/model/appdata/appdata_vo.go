package appdata

import (
	"github.com/kere/gos/db"
)

type AppDataVO struct {
	db.BaseVO
	Name  string `json:"name" skip:"update"`
	Value string `json:"value"`
}

func NewAppDataVO(name, val string) *AppDataVO {
	vo := &AppDataVO{
		Name:  name,
		Value: val,
	}

	vo.Init(vo)
	return vo
}

func (a *AppDataVO) Table() string {
	return "appdata"
}
