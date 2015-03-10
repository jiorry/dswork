package public

import (
	"../../../lib/auth"
	"fmt"
	"github.com/kere/gos"
	"github.com/kere/gos/lib/util"
)

type SignApi struct {
	gos.WebApi
}

func (a *SignApi) AutoLogin() (util.MapData, error) {
	au := a.GetUserAuth().(*auth.UserAuth)
	usrVO, isBindIp := au.BindIpUser()
	m := util.MapData{}
	m["success"] = false

	if !isBindIp {
		return m, nil
	}

	m["user"] = usrVO
	m["success"] = true

	return m, nil
}

func (a *SignApi) BindIpUser() (*auth.UserVO, error) {
	au := a.GetUserAuth().(*auth.UserAuth)
	usrVO, _ := au.BindIpUser()

	return usrVO, nil
}

func (a *SignApi) ChangePassword(args util.MapData) (bool, error) {
	nick := args.GetString("nick")
	cipher := args.GetString("cipher")
	// code := args.GetString("code")

	userVO, err := a.BindIpUser()
	if err != nil {
		return false, err
	}

	if userVO.Nick != nick {
		return false, fmt.Errorf("%s已经绑定IP登录，不能修改其他用户的密码", userVO.Nick)
	}

	err = auth.ChangePassword(userVO.Id, userVO.Nick, cipher)
	if err != nil {
		return false, err
	}

	return true, nil
}
