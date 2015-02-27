package appdata

import (
	"github.com/kere/gos/db"
)

type AppDataModel struct {
	db.BaseModel
}

func NewAppDataModel() *AppDataModel {
	m := &AppDataModel{}
	m.Init(&AppDataVO{})
	return m
}

func (a *AppDataModel) QueryOne(k string) (db.DataRow, error) {
	return a.QueryBuilder().Where("name=?", k).QueryOne()
}
