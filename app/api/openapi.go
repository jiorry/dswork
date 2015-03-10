package api

import (
	"../lib/auth"
	"./openapi/drawing"
	"./openapi/public"
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

func init() {
	regist("drawing.app", &drawing.AppApi{})
	regist("public.site", &public.PublicApi{})
	regist("public.sign", &public.SignApi{})
}

type OpenApi struct {
	gos.OpenApi
}

func (a *OpenApi) Prepare() bool {
	a.SetUserAuth(auth.New(a.WebApi.Ctx))
	return true
}

func (a *OpenApi) Factory(n string) (gos.IApi, error) {
	if v, ok := apiMap[n]; ok {
		api := reflect.New(v).Interface().(gos.IApi)
		api.SetUserAuth(a.GetUserAuth())
		return api, nil
	}
	return nil, fmt.Errorf("api %s not registed", n)
}
