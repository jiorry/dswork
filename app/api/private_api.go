package api

import (
	"../lib/auth"
	"../model/appdata"
	"../model/drawing"
	"../model/project"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"
)

type Private struct {
	gos.WebApi
}

func (a *Private) Prepare() bool {
	au := auth.New(a.Ctx)
	a.SetUserAuth(au)
	return au.IsOk()
}

func (a *Private) DrawingData(args util.MapData) (db.DataRow, error) {
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

func (a *Private) DrawSave(args util.MapData) (int, error) {
	id := args.GetInt64("id")
	name := args.GetString("name")
	userId := a.GetUserAuth().UserId()
	subjectId := args.GetInt64("subject_id")
	projectId := args.GetInt64("project_id")
	no := args.GetString("no")
	drawingNo := args.GetString("drawing_no")
	zrz := args.GetInt64("zrz")
	a1 := args.GetInt64("a1")
	quantity := args.GetInt64("quantity")
	xmjlId := args.GetInt64("xmjl_id")

	vo := drawing.NewDrawingVO(name, userId, subjectId, projectId, no, drawingNo, zrz, a1, quantity, xmjlId)

	var err error
	if id > 0 {
		vo.Id = id
		err = vo.Update()
	} else {
		err = vo.Create()
	}

	if err != nil {
		return 0, err
	}

	return 1, nil
}

func (a *Private) AppData() (util.MapData, error) {
	m := util.MapData{}
	appdataModel := appdata.NewAppDataModel()
	// subjects
	subjects, err := appdataModel.GetSubjects()
	if err != nil {
		return nil, err
	}

	m["subjects"] = subjects
	m["draw_sign_js"], _ = appdataModel.GetUsers("draw_sign_js")
	m["draw_sign_sw"], _ = appdataModel.GetUsers("draw_sign_sw")
	m["draw_sign_xmgl"], _ = appdataModel.GetUsers("draw_sign_xmgl")
	m["draw_sign_xmjl"], _ = appdataModel.GetUsers("draw_sign_xmjl")
	m["draw_sign_zt"], _ = appdataModel.GetUsers("draw_sign_zt")

	m["projects"] = project.NewProjectModel().Projects()

	return m, nil
}
