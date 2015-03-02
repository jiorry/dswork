package appdata

import (
	"fmt"
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

func (a *AppDataModel) GetSubjects() ([]interface{}, error) {
	r, err := a.QueryOne("subjects")
	if err != nil {
		return nil, err
	}

	subjects := make([]interface{}, 0)
	err = r.JsonParse("value", &subjects)
	return subjects, err
}

func (a *AppDataModel) GetUsers(key string) (db.DataSet, error) {
	r, err := a.QueryOne(key)
	if err != nil {
		return nil, err
	}

	data, err := db.NewQueryBuilder("users").Select("id,nick,email,phone,avatar,bind_ip,status").Where(fmt.Sprint("id in (", r.GetString("value"), ") and status>0")).Query()

	data.Bytes2String()
	return data, err
}
