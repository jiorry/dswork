package auth

import (
	"bytes"
	"fmt"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"
	"strings"
	"time"
)

var separator []byte = []byte("|")

func QueryAndBuildById(id int64) db.DataRow {
	usr := New(nil).QueryById(id)
	if usr.Empty() {
		return usr
	}

	return BuildAvatar(usr)
}

func BuildAvatar(usr db.DataRow) db.DataRow {
	if usr.IsNull("avatar") || usr.GetString("avatar") == "" {
		usr["isAvatar"] = false
		usr["avatar"] = "/assets/img/avatar_empty.png"
	} else {
		usr["isAvatar"] = true
		usr["avatar"] = fmt.Sprint("/upload/avatar/", usr.GetString("avatar"))
	}
	return usr
}

func QueryUserByNick(n string) db.DataRow {
	return New(nil).Query(n)
}

// func QueryByEmail(email string) db.DataRow {
// 	return New(nil).QueryByEmail(email)
// }

type UserVO struct {
	db.BaseVO
	Id     int64  `json:"id"`
	Nick   string `json:"nick"`
	Avatar string `json:"avatar"`
	Email  string `json:"email"`
	BindIp string `json:"bind_ip"`

	Status  int       `json:"status"`
	Created time.Time `json:"created_at"`
	LastSee time.Time `json:"last_see_at"`
}

func NewUserVO(u db.DataRow) *UserVO {
	if u.Empty() {
		return &UserVO{
			Id:     int64(0),
			Nick:   "empty",
			Avatar: "empty",
		}
	}
	vo := &UserVO{}
	u.CopyToStruct(vo)
	return vo
}

type UserAuth struct {
	gos.UserAuth
}

func ChangePassword(id int64, cipher string) error {
	_, b, err := gos.PraseCipher([]byte(cipher))
	if err != nil {
		return gos.NewError(0, err)
	}

	arr := bytes.Split(b, separator)

	obj := db.DataRow{}
	obj["salt"], obj["token"] = UserToken(string(arr[0]), arr[1])
	_, err = db.NewUpdateBuilder("users").Where("id=?", id).Update(obj)
	return err
}

func UserToken(nick string, pwd []byte) (string, string) {
	salt := util.Unique()
	return salt, gos.UserToken([]interface{}{nick}, pwd, []byte(salt))
}

func New(ctx *gos.Context) *UserAuth {
	auth := (&UserAuth{})
	auth.Init(ctx)
	vo := auth.GetOptions()
	auth.SetKeys(vo.FieldNick)
	return auth
}

// ---------------------------------
func (u *UserAuth) GetUserVO() *UserVO {
	return NewUserVO(u.User())
}

func (u *UserAuth) SetCookie(age int64) {
	u.UserAuth.UserAuthBase.SetCookie(u.Keys(), u.User(), age)
}

func (u *UserAuth) Nick() string {
	return u.User().GetString("nick")
}

func (a *UserAuth) BindIpUser() (*UserVO, bool) {
	usr := a.QueryByBindIp()
	if usr.Empty() {
		return nil, false
	}

	if usr.GetInt("status") < 0 {
		return nil, false
	}

	vo := &UserVO{}
	BuildAvatar(usr).CopyToStruct(vo)

	return vo, true
}

func (a *UserAuth) QueryByBindIp() db.DataRow {
	arr := strings.Split(a.GetContext().Request.RemoteAddr, ":")
	fmt.Println("-------BindIp:", arr)
	ip := arr[0]
	if ip == "" {
		return nil
	}
	r, _ := db.NewQueryBuilder(a.GetOptions().Table).Where("bind_ip=?", ip).QueryOne()
	return r
}

func (a *UserAuth) QueryById(id int64) db.DataRow {
	r, _ := db.NewQueryBuilder(a.GetOptions().Table).Where("id=?", id).Cache().QueryOne()
	return r
}

func (a *UserAuth) Query(nick string) db.DataRow {
	return a.QueryByKeys([]string{"nick"}, []interface{}{nick})
}

// func (a *UserAuth) QueryByEmail(email string) db.DataRow {
// 	return a.QueryByKeys([]string{"email"}, []interface{}{email})
// }

func (a *UserAuth) ClearCache() {
	a.ClearCacheByKeys([]string{"nick"}, []interface{}{a.User().GetString("nick")})
	// a.ClearCacheByKeys([]string{"email"}, []interface{}{a.User().GetString("email")})
	db.NewQueryBuilder(a.GetOptions().Table).Where("id=?", a.UserId()).ClearCache()
}

func (a *UserAuth) CookieLang() string {
	cookie, err := a.GetContext().Request.Cookie("lang")
	if err != nil {
		return "en-US"
	}
	return cookie.Value
}
