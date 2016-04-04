package public

import (
	"fmt"

	"github.com/jiorry/dswork/app/lib/auth"
	"github.com/kere/gos"
	"github.com/kere/gos/lib/util"
)

type SignApi struct {
	gos.WebApi
}

func (a *SignApi) IsSecurity() bool {
	return false
}

func (a *SignApi) UserLogin(args util.MapData) (*auth.UserVO, error) {
	au := a.GetUserAuth().(*auth.UserAuth)
	usrVO, isBindIp := au.BindIpUser()
	if !isBindIp {
		return nil, fmt.Errorf("只允许绑定IP用户登录系统，如需帮助请与管理员联系")
	}

	err := au.Login(args.GetString("cipher"))
	if err != nil {
		return nil, fmt.Errorf("登录失败，请检查登录名和密码是否正确")
	}

	user := au.User()

	if user.GetString("nick") != usrVO.Nick {
		au.LoginOut()
		return nil, fmt.Errorf("本机已经绑定IP，用户 %s 不允许登录", user.GetString("nick"))
	}

	au.SetCookie(30 * 24 * 3600)

	return usrVO, err
}

func (a *SignApi) BindIpUser() (*auth.UserVO, error) {
	au := a.GetUserAuth().(*auth.UserAuth)
	usrVO, _ := au.BindIpUser()

	return usrVO, nil
}

func (a *SignApi) InitPassword(args util.MapData) (bool, error) {
	cipher := args.GetString("cipher")
	// code := args.GetString("code")

	userVO, err := a.BindIpUser()
	if err != nil {
		return false, err
	}

	if userVO.Status != 0 {
		return false, fmt.Errorf("不能使用初始密码功能修改用户密码")
	}

	err = auth.ChangePassword(userVO.Id, cipher)
	if err != nil {
		return false, err
	}

	err = a.GetUserAuth().ChangeStatus(userVO.Id, 1)
	if err != nil {
		return false, err
	}

	return true, nil
}
