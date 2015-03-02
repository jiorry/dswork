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
