package drawing

import (
	"../../lib/auth"
	"fmt"
	"github.com/kere/gos/db"
	"time"
)

const (
	STATUS_FINISH = 9
	STATUS_RUN    = 1
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

func (d *DrawingModel) Items(status int) (db.DataSet, error) {
	ds, err := d.QueryBuilder().UnSelect("js_unsign_json", "sw_unsign_json", "zt_unsign_json", "xmgl_unsign_json", "xmjl_unsign_json").Order("created desc").Where("status=?", status).Query()
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

func (d *DrawingModel) QueryByDateRange(b, e time.Time, status int) (db.DataSet, error) {
	ds, err := d.QueryBuilder().UnSelect("js_unsign_json", "sw_unsign_json", "zt_unsign_json", "xmgl_unsign_json", "xmjl_unsign_json").Order("created desc").Where("created between ? and ? and status=?", b, e, status).Query()
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
			_, err = db.NewUpdateBuilder(d.Table()).Where("id=?", id).Update(data)
			if err != nil {
				return err
			}
		}
	}

	return err
}
