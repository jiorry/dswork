package private

import (
	"fmt"

	"github.com/jiorry/dswork/app/lib/auth"
	"github.com/kere/gos"
	"github.com/kere/gos/lib/util"
)

type SignApi struct {
	gos.WebApi
}

func (s *SignApi) ChangePassword(args util.MapData) (bool, error) {
	old := args.GetString("old")
	cipher := args.GetString("cipher")

	err := s.GetUserAuth().CheckCipher(old)
	if err != nil {
		return false, fmt.Errorf("登录名和原始密码不匹配，请确认后重新输入")
	}

	err = auth.ChangePassword(s.GetUserAuth().UserId(), cipher)
	if err != nil {
		return false, err
	}

	err = s.GetUserAuth().ChangeStatus(s.GetUserAuth().UserId(), 1)
	if err != nil {
		return false, err
	}

	return true, nil
}
