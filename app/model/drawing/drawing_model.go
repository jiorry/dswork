package drawing

import (
	"fmt"
	"time"

	"github.com/jiorry/dswork/app/lib/auth"
	"github.com/kere/gos/db"
)

const (
	STATUS_FINISH  = 9
	STATUS_HISTORY = 10
	STATUS_RUN     = 1
)

type UnSignData struct {
	UID  int64     `json:"uid"`
	Time time.Time `json:"time"`
}

type DrawingModel struct {
	db.BaseModel
}

func NewDrawingModel() *DrawingModel {
	m := &DrawingModel{}
	m.Init(&DrawingVO{})
	return m
}

func (d *DrawingModel) Remove(id int64) error {
	r, err := d.QueryById(id)
	if r.GetInt64("xmjl_sign_by") > 0 || r.GetInt64("js_sign_by") > 0 || r.GetInt64("xmgl_sign_by") > 0 || r.GetInt64("sw_sign_by") > 0 || r.GetInt64("zt_sign_by") > 0 {
		return fmt.Errorf("必须所以人员都撤销签字，才可以删除这个表单")
	}

	data := db.DataRow{}
	data["status"] = -1
	_, err = db.NewUpdateBuilder("drawing").Where("id=?", id).Update(data)
	return err
}

func (d *DrawingModel) Items() (db.DataSet, error) {
	ds, err := d.QueryBuilder().UnSelect("js_unsign_json", "sw_unsign_json", "zt_unsign_json", "xmgl_unsign_json", "xmjl_unsign_json").Order("created desc").Where("status in (1, 9)").Query()
	count := len(ds)
	for i := 0; i < count; i++ {
		ds[i]["user"] = auth.QueryAndBuildById(ds[i].GetInt64("user_id")).Bytes2String()
	}
	if err != nil {
		return nil, err
	}

	ds.Bytes2String()
	return ds, nil
}

func (d *DrawingModel) MoveToHistory() error {
	data := db.DataRow{}
	data["status"] = STATUS_HISTORY

	due := time.Now().AddDate(0, 0, -10)

	_, err := db.NewUpdateBuilder("drawing").Where("status=? and finish_at<?", STATUS_FINISH, due).Update(data)
	return err
}

func (d *DrawingModel) Finish() error {
	data := db.DataRow{}
	data["status"] = STATUS_FINISH
	data["finish_at"] = time.Now()

	_, err := db.NewUpdateBuilder("drawing").Where("status=1 and xmgl_sign_by>0 and xmjl_sign_by>0 and sw_sign_by>0 and zt_sign_by>0 and js_sign_by>0").Update(data)
	return err
}

func (d *DrawingModel) QueryByDateRange(b, e time.Time, projectId, subjectId int64) (db.DataSet, error) {
	var ds db.DataSet
	var err error

	if projectId == 0 && subjectId == 0 {
		ds, err = d.QueryBuilder().UnSelect("js_unsign_json", "sw_unsign_json", "zt_unsign_json", "xmgl_unsign_json", "xmjl_unsign_json").Order("created desc").
			Where("created between ? and ? and status>0", b, e).Query()
	} else if projectId != 0 && subjectId == 0 {
		ds, err = d.QueryBuilder().UnSelect("js_unsign_json", "sw_unsign_json", "zt_unsign_json", "xmgl_unsign_json", "xmjl_unsign_json").Order("created desc").
			Where("created between ? and ? and status>0 and project_id=?", b, e, projectId).Query()
	} else if projectId == 0 && subjectId != 0 {
		ds, err = d.QueryBuilder().UnSelect("js_unsign_json", "sw_unsign_json", "zt_unsign_json", "xmgl_unsign_json", "xmjl_unsign_json").Order("created desc").
			Where("created between ? and ? and status>0 and subject_id=?", b, e, subjectId).Query()
	} else {
		ds, err = d.QueryBuilder().UnSelect("js_unsign_json", "sw_unsign_json", "zt_unsign_json", "xmgl_unsign_json", "xmjl_unsign_json").Order("created desc").
			Where("created between ? and ? and status>0 and project_id=? and subject_id=?", b, e, projectId, subjectId).Query()
	}

	count := len(ds)
	for i := 0; i < count; i++ {
		ds[i]["user"] = auth.QueryAndBuildById(ds[i].GetInt64("user_id")).Bytes2String()
	}
	if err != nil {
		return nil, err
	}

	ds.Bytes2String()
	return ds, nil
}

func (d *DrawingModel) DoSign(id, signUserId int64, typ string, sign bool, day int) error {
	data := db.DataRow{}
	r, err := d.QueryById(id)

	if sign {
		data[typ+"_sign_by"] = signUserId
		data[typ+"_sign_at"] = time.Now()
	} else {
		uid := r.GetInt64(typ + "_sign_by")
		if uid != signUserId {
			return fmt.Errorf("不能撤销其他人的签名")
		}

		data[typ+"_sign_by"] = 0
		data[typ+"_sign_at"] = nil

		unsignData := &UnSignData{r.GetInt64(typ + "_sign_by"), time.Now()}

		v := make([]*UnSignData, 0)
		r.JsonParse(typ+"_unsign_json", &v)
		v = append(v, unsignData)

		data[typ+"_unsign_json"] = v
		data["finish_at"] = nil
	}

	if typ == "zt" {
		if sign {
			data["draw_plan"] = day
		} else {
			data["draw_plan"] = 0
		}
	}

	_, err = db.NewUpdateBuilder(d.Table()).Where("id=?", id).Update(data)
	if err != nil {
		return err
	}

	if sign {
		if r.GetInt64("xmjl_sign_by") > 0 && r.GetInt64("js_sign_by") > 0 && r.GetInt64("sw_sign_by") > 0 && r.GetInt64("xmgl_sign_by") > 0 && r.GetInt64("zt_sign_by") > 0 {
			data = db.DataRow{}
			data["status"] = STATUS_FINISH
			data["finish_at"] = time.Now()
			_, err = db.NewUpdateBuilder(d.Table()).Where("id=?", id).Update(data)
			if err != nil {
				return err
			}
		}
	}

	return err
}
