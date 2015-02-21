package plugin

import (
	"../../../lib/auth"
	"../../../model/plugin/note"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"
	"time"
)

type NoteApi struct {
	gos.WebApi
	Auth *auth.UserAuth
}

func (a *NoteApi) Init() bool {
	a.Auth = auth.New(a.WebApi.Ctx)
	a.SetUserAuth(a.Auth)
	time.Sleep(time.Duration(int64(1) * 1e9))
	return a.CheckAuth()
}

func (a *NoteApi) SelectTag(args util.MapData) (util.MapData, error) {
	// note_tag_id:tagId, note_item_id: itemId
	tagId := args.GetInt64("note_tag_id")
	itemCid := args.GetString("note_item_cid")
	noteItemModel := note.NewNoteItemModel()

	result := util.MapData{}
	items, err := noteItemModel.QueryByTagId(tagId)
	if err != nil {
		return nil, err
	}
	if itemCid != "" {
		result["item"], err = noteItemModel.QueryOneByCid(itemCid)
		if err != nil {
			return nil, err
		}
	} else if itemCid == "" && len(items) > 0 {
		result["item"], err = noteItemModel.QueryOneByCid(items[0].GetString("cid"))
		if err != nil {
			return nil, err
		}
	} else {
		result["item"] = nil
	}
	result["items"] = items
	return result, nil
}

func (a *NoteApi) AddNoteTag(args util.MapData) (util.MapData, error) {
	userId := a.Auth.UserId()
	noteTagModel := note.NewNoteTagModel()
	tagVo, err := noteTagModel.CreateDefault(userId, args.GetInt64("note_id"))
	if err != nil {
		return nil, err
	}

	noteItemModel := note.NewNoteItemModel()
	itemVo, err := noteItemModel.CreateDefault(userId, tagVo.Id)
	if err != nil {
		return nil, err
	}

	result := util.MapData{}
	result["tag"] = tagVo
	result["item"] = itemVo

	return result, nil
}

func (a *NoteApi) SaveTagName(args util.MapData) (interface{}, error) {
	noteTagModel := note.NewNoteTagModel()
	if args.IsSet("id") && args.GetInt64("id") > 0 {
		noteTagModel.Update(args.GetInt64("id"), args.GetString("title"))
	}

	return nil, nil
}

func (a *NoteApi) DeleteNoteTag(args util.MapData) (db.DataRow, error) {
	// DeleteNoteTag, {tagid:currentTagid, delete_id: tagid
	noteTagModel := note.NewNoteTagModel()
	err := noteTagModel.Delete(args.GetInt64("delete_id"))
	if err != nil {
		return nil, err
	}

	result := db.DataRow{}
	noteItemModel := note.NewNoteItemModel()
	items, err := noteItemModel.QueryByTagId(args.GetInt64("tag_id"))
	if err != nil {
		return nil, err
	}

	if len(items) > 0 {
		result["item"], err = noteItemModel.QueryOneByCid(items[0].GetString("cid"))
		if err != nil {
			return nil, err
		}
	} else {
		result["item"] = nil
	}
	result["items"] = items

	return result, nil
}

func (a *NoteApi) UserNoteData(args util.MapData) (util.MapData, error) {
	itemCid := args.GetString("item_cid")
	userId := a.Auth.UserId()

	noteModel := note.NewNoteModel()
	return noteModel.UserNoteData(userId, itemCid)
}

func (a *NoteApi) UpdateNoteItem(args util.MapData) (bool, error) {
	noteItemModel := note.NewNoteItemModel()
	err := noteItemModel.Update(db.DataRow(args), args.GetString("cid"))
	return true, err
}

func (a *NoteApi) GetNoteItem(cid string) (db.DataRow, error) {
	noteItemModel := note.NewNoteItemModel()
	return noteItemModel.QueryOneByCid(cid)
}

func (a *NoteApi) AddNoteItem(args util.MapData) (*note.NoteItemVO, error) {
	if !args.IsSet("note_tag_id") {
		return nil, gos.NewError(0, "parameter is mission.").LogError()
	}
	noteItemModel := note.NewNoteItemModel()
	return noteItemModel.CreateDefault(a.Auth.UserId(), args.GetInt64("note_tag_id"))
}

func (a *NoteApi) DeleteNoteItem(args util.MapData) (db.DataRow, error) {
	noteItemModel := note.NewNoteItemModel()
	err := noteItemModel.DeleteByCid(args.GetString("delete_cid"))
	if err != nil {
		return nil, err
	}
	if args.GetString("cid") == "" {
		return nil, nil
	}
	return noteItemModel.QueryOneByCid(args.GetString("cid"))
}
