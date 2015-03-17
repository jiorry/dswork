package appdata

import (
	"fmt"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"strings"
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
	return a.QueryBuilder().Where("name=?", k).Cache().QueryOne()
}

func (a *AppDataModel) Val(k string) string {
	r, err := a.QueryBuilder().Where("name=?", k).Cache().QueryOne()
	if err != nil {
		gos.DoError(err)
		return ""
	}
	if r.Empty() {
		return ""
	}
	r.Bytes2String()
	return r.GetString("value")
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

func (a *AppDataModel) GetUsers(key string) ([]string, db.DataSet, error) {
	val := a.Val("key")

	if val == "" {
		return []string{}, nil, nil
	}

	data, err := db.NewQueryBuilder("users").CacheExpire(300).Select("id,nick,email,phone,avatar,bind_ip,status").Where(fmt.Sprint("id in (", val, ") and status>0")).Query()
	data.Bytes2String()

	return strings.Split(val, ","), data, err
}
