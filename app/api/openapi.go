package api

import (
	"../lib/auth"
	"fmt"
	"github.com/kere/gos"
	"reflect"
)

var apiMap = make(map[string]reflect.Type)

func regist(n string, a interface{}) {
	typ := reflect.TypeOf(a)
	if typ.Kind() == reflect.Ptr {
		typ = typ.Elem()
	}
	apiMap[n] = typ
}

type OpenApi struct {
	gos.OpenApi
}

func (a *OpenApi) Prepare() bool {
	a.SetUserAuth(auth.New(a.WebApi.Ctx))

	if a.GetUserAuth().IsOk() {
		return true
	} else {
		gos.NewError(0, "login failed").Write(a.Ctx.ResponseWriter)
		return false
	}
}

func (a *OpenApi) Factory(n string) (gos.IApi, error) {
	if v, ok := apiMap[n]; ok {
		api := reflect.New(v).Interface().(gos.IApi)
		api.SetUserAuth(a.GetUserAuth())
		return api, nil
	}
	return nil, fmt.Errorf("api %s not registed", n)
}
