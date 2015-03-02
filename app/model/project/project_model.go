package project

import (
	"github.com/kere/gos/db"
)

type ProjectModel struct {
	db.BaseModel
}

func NewProjectModel() *ProjectModel {
	m := &ProjectModel{}
	m.Init(&ProjectVO{})
	return m
}

func (p *ProjectModel) Projects() db.DataSet {
	ds, _ := p.Query("status>0")
	ds.Bytes2String()
	return ds
}
