package api

import (
	"../lib/auth"
	"../model/appdata"
	"fmt"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"

	"time"
)

type Public struct {
	gos.WebApi
}

func (a *Public) IsExists(args util.MapData) (int, error) {
	table := "users"
	field := args.GetString("field")
	val := args.GetString("value")

	exists := db.NewExistsBuilder(table).Where(field+"=?", val)
	isEx, err := exists.Exists()
	if err != nil {
		return -1, err
	}
	if isEx {
		return 1, nil
	} else {
		return 0, nil
	}
}

func (a *Public) Rsakey() (map[string]interface{}, error) {
	k := gos.GetRSAKey(0)
	m := make(map[string]interface{}, 0)
	m["hex"] = fmt.Sprintf("%x", k.Key.PublicKey.N)
	m["keyid"] = k.CreatedAt.Unix()
	m["unix"] = time.Now().Unix()
	return m, nil
}

func (a *Public) LoginByIp() (util.MapData, error) {
	au := auth.New(a.Ctx)
	usrVO, isOk := au.LoginByBindIp()
	m := util.MapData{}
	m["success"] = false

	if !isOk {
		return m, nil
	}

	appdataModel := appdata.NewAppDataModel()
	r, err := appdataModel.QueryOne("subjects")
	if err != nil {
		return nil, err
	}
	subjects := r.GetStringSlice("value")
	m["subjects"] = subjects
	m["user"] = usrVO
	m["success"] = true

	return m, nil
}
