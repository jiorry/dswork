package drawing

import (
	"../../../lib/auth"
	"../../../model/appdata"
	"../../../model/drawing"
	"../../../model/project"
	"fmt"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"
	"strings"
)

type AppApi struct {
	gos.WebApi
}

func (a *AppApi) AppData() (util.MapData, error) {

	appdataModel := appdata.NewAppDataModel()
	// subjects
	subjects, err := appdataModel.GetSubjects()
	if err != nil {
		return nil, err
	}

	m := util.MapData{}
	m["subjects"] = subjects
	m["projects"] = project.NewProjectModel().Projects()

	m["draw_js_user_ids"] = strings.Split(appdataModel.Val("draw_js_users"), ",")
	m["draw_sw_user_ids"] = strings.Split(appdataModel.Val("draw_sw_users"), ",")
	m["draw_xmgl_user_ids"] = strings.Split(appdataModel.Val("draw_xmgl_users"), ",")
	m["draw_xmjl_user_ids"] = strings.Split(appdataModel.Val("draw_xmjl_users"), ",")
	m["draw_zt_user_ids"] = strings.Split(appdataModel.Val("draw_zt_users"), ",")

	allUsers, _ := db.NewQueryBuilder("users").Select("id,nick,avatar,status").Cache().Query()
	allUsers.Bytes2String()
	count := len(allUsers)
	for i := 0; i < count; i++ {
		allUsers[i] = auth.BuildAvatar(allUsers[i])
	}

	m["all_users"] = allUsers

	return m, nil
}

func (a *AppApi) ItemData(args util.MapData) (db.DataRow, error) {
	r, err := drawing.NewDrawingModel().QueryById(args.GetInt64("id"))
	if err != nil {
		return nil, err
	}

	if r.Empty() {
		return nil, gos.DoError("没有找到这条记录！")
	}

	if r.GetInt64("user_id") != a.GetUserAuth().UserId() {
		return nil, gos.DoError("您不能修改其他人创建的表单！")
	}

	r.Bytes2String()
	return r, nil
}

func (a *AppApi) ItemViewData(args util.MapData) (db.DataRow, error) {
	r, err := drawing.NewDrawingModel().QueryById(args.GetInt64("id"))
	if err != nil {
		return nil, err
	}

	if r.Empty() {
		return nil, gos.DoError("没有找到这条记录！")
	}

	r.Bytes2String()
	return r, nil
}

func (a *AppApi) Save(args util.MapData) (int, error) {
	id := args.GetInt64("id")
	name := args.GetString("name")
	userId := a.GetUserAuth().UserId()
	subjectId := args.GetInt64("subject_id")
	projectId := args.GetInt64("project_id")
	no := args.GetString("no")
	drawingNo := args.GetString("drawing_no")
	zrz := args.GetFloat("zrz")
	a1 := args.GetFloat("a1")
	quantity := args.GetFloat("quantity")
	xmjlId := args.GetInt64("xmjl_id")
	memo := args.GetString("memo")

	vo := drawing.NewDrawingVO(name, userId, subjectId, projectId, no, drawingNo, zrz, a1, quantity, xmjlId, memo)

	var err error
	if id > 0 {
		vo.Id = id
		r, err := drawing.NewDrawingModel().QueryById(id)
		if err != nil {
			return 0, err
		}
		if r.GetInt64("xmjl_sign_by") > 0 || r.GetInt64("js_sign_by") > 0 || r.GetInt64("sw_sign_by") > 0 || r.GetInt64("xmgl_sign_by") > 0 || r.GetInt64("zt_sign_by") > 0 {
			return 0, fmt.Errorf("请先撤销所有的签字后，才能进行修改")
		}
		err = vo.Update()
	} else {
		err = vo.Create()
	}

	if err != nil {
		return 0, err
	}

	return 1, nil
}

func (a *AppApi) DrawItems(args util.MapData) (db.DataSet, error) {
	// page := args.GetInt("page")
	// pageSize := 30
	var pid int64 = 0
	var sid int64 = 0

	if args.IsSet("project_id") {
		pid = args.GetInt64("project_id")
	}

	if args.IsSet("subject_id") {
		sid = args.GetInt64("subject_id")
	}

	md := drawing.NewDrawingModel()

	if args.IsSet("begin") {
		return md.QueryByDateRange(args.GetTime("begin"), args.GetTime("end"), pid, sid)
	}

	if pid == 0 && sid == 0 {
		md.Finish()
		md.MoveToHistory()
	}

	return md.Items()
}

func (a *AppApi) DoSign(args util.MapData) (bool, error) {
	userId := a.GetUserAuth().UserId()
	typ := args.GetString("typ")
	sign := args.GetBool("sign")
	id := args.GetInt64("item_id")
	day := 0

	if !args.IsNull("day") {
		day = args.GetInt("day")
	}

	err := drawing.NewDrawingModel().DoSign(id, userId, typ, sign, day)
	if err != nil {
		return false, err
	}

	return true, err
}

func (a *AppApi) DoRemove(args util.MapData) (bool, error) {
	id := args.GetInt64("item_id")
	err := drawing.NewDrawingModel().Remove(id)
	return err == nil, err
}
