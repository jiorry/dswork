package drawing

import (
	"github.com/kere/gos/db"
	"time"
)

type DrawingVO struct {
	db.BaseVO
	Id        int64   `json:"id" skip:"all"`
	Name      string  `json:"name"`
	UserId    int64   `json:"user_id" skip:"update"`
	SubjectId int64   `json:"subject_id"`
	ProjectId int64   `json:"project_id"`
	No        string  `json:"no"`
	DrawingNo string  `json:"drawing_no"`
	Zrz       float64 `json:"zrz"`
	A1        float64 `json:"a1"`
	Quantity  float64 `json:"quantity"`
	Status    int     `json:"status"`

	XmjlId     int64 `json:"xmjl_id"`
	IsXmjlSign bool  `json:"is_xmjl_sign"`

	JsSignBy   int64 `json:"js_sign_by"`
	SwSignBy   int64 `json:"sw_sign_by"`
	XmglSignBy int64 `json:"xmgl_sign_by"`
	ZtSignBy   int64 `json:"zt_sign_by"`

	DrawPlan int `json:"draw_plan"`

	Created time.Time `json:"created" autotime:"true"`
}

func NewDrawingVO(name string, userId, subjectId, projectId int64, no, drawingNo string, zrz, a1, quantity float64, xmjlId int64) *DrawingVO {
	vo := &DrawingVO{
		Name:       name,
		UserId:     userId,
		SubjectId:  subjectId,
		ProjectId:  projectId,
		No:         no,
		DrawingNo:  drawingNo,
		Zrz:        zrz,
		A1:         a1,
		Quantity:   quantity,
		Status:     1,
		XmjlId:     xmjlId,
		IsXmjlSign: false,
	}

	vo.Init(vo)
	return vo
}

func (a *DrawingVO) Table() string {
	return "drawing"
}
