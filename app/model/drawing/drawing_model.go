package drawing

import (
	"github.com/kere/gos/db"
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
	return err
}
