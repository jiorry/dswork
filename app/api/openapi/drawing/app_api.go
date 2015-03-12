package drawing

import (
	"../../../lib/auth"
	"../../../model/appdata"
	"../../../model/drawing"
	"../../../model/project"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"
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

	m["draw_js_user_ids"], m["draw_js_users"], _ = appdataModel.GetUsers("draw_js_users")
	m["draw_sw_user_ids"], m["draw_sw_users"], _ = appdataModel.GetUsers("draw_sw_users")
	m["draw_xmgl_user_ids"], m["draw_xmgl_users"], _ = appdataModel.GetUsers("draw_xmgl_users")
	m["draw_xmjl_user_ids"], m["draw_xmjl_users"], _ = appdataModel.GetUsers("draw_xmjl_users")
	m["draw_zt_user_ids"], m["draw_zt_users"], _ = appdataModel.GetUsers("draw_zt_users")

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

	r["js_user"] = nil
	r["xmjl_user"] = nil
	r["xmgl_user"] = nil
	r["sw_user"] = nil
	r["zt_user"] = nil

	r["user"] = auth.QueryAndBuildById(r.GetInt64("user_id")).Bytes2String()

	if r.GetInt64("js_sign_by") > 0 {
		r["js_user"] = auth.QueryAndBuildById(r.GetInt64("js_sign_by")).Bytes2String()
	}

	if r.GetInt64("xmjl_id") > 0 {
		r["xmjl_user"] = auth.QueryAndBuildById(r.GetInt64("xmjl_id")).Bytes2String()
	}

	if r.GetInt64("xmgl_sign_by") > 0 {
		r["xmgl_user"] = auth.QueryAndBuildById(r.GetInt64("xmgl_sign_by")).Bytes2String()
	}

	if r.GetInt64("sw_sign_by") > 0 {
		r["sw_user"] = auth.QueryAndBuildById(r.GetInt64("sw_sign_by")).Bytes2String()
	}

	if r.GetInt64("zt_sign_by") > 0 {
		r["zt_user"] = auth.QueryAndBuildById(r.GetInt64("zt_sign_by")).Bytes2String()
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

func (a *AppApi) DrawItems(args util.MapData) (db.DataSet, error) {
	page := args.GetInt("page")
	pageSize := 30

	md := drawing.NewDrawingModel()
	ds, err := md.QueryBuilder().Order("created desc").Page(page, pageSize).Where("status>0").Query()
	count := len(ds)
	for i := 0; i < count; i++ {
		ds[i]["user"] = auth.QueryAndBuildById(ds[i].GetInt64("user_id")).Bytes2String()
	}
	if err != nil {
		return nil, err
	}

	return ds.Bytes2String(), nil
}

func (a *AppApi) DoSign(args util.MapData) (bool, error) {
	userId := a.GetUserAuth().UserId()
	typ := args.GetString("typ")
	sign := args.GetBool("sign")
	id := args.GetInt64("item_id")

	err := drawing.NewDrawingModel().DoSign(id, userId, typ, sign)
	if err != nil {
		return false, err
	}

	return true, err
}
