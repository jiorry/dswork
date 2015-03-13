package drawing

import (
	"github.com/kere/gos/db"
)

const (
	STATUS_FINISH = 9
	STATUS_RUN    = 1
)

type DrawingModel struct {
	db.BaseModel
}

func NewDrawingModel() *DrawingModel {
	m := &DrawingModel{}
	m.Init(&DrawingVO{})
	return m
}

func (d *DrawingModel) DoSign(id, signUserId int64, typ string, sign bool) error {
	data := db.DataRow{}
	if typ == "xmjl" {
		data["is_xmjl_sign"] = sign

	} else {
		field := typ + "_sign_by"
		if sign {
			data[field] = signUserId
		} else {
			data[field] = 0
		}
	}

	_, err := db.NewUpdateBuilder(d.Table()).Where("id=?", id).Update(data)
	if err != nil {
		return err
	}

	if sign {
		r, err := d.QueryById(id)
		if r.GetBool("is_xmjl_sign") && r.GetInt64("js_sign_by") > 0 && r.GetInt64("sw_sign_by") > 0 && r.GetInt64("xmgl_sign_by") > 0 && r.GetInt64("zt_sign_by") > 0 {
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
