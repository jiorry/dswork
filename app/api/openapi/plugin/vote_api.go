package plugin

import (
	"../../../lib/auth"
	"../../../model/event"
	"../../../model/plugin/vote"
	"github.com/kere/gos"
	"github.com/kere/gos/db"
	"github.com/kere/gos/lib/util"
)

type VoteApi struct {
	gos.WebApi
	au *auth.UserAuth
}

func (a *VoteApi) Save(row util.MapData) (bool, error) {
	// row := db.DataRow(args)
	var id int64 = 0
	if row.IsSet("id") {
		id = row.GetInt64("id")
	}

	var err error

	voters := make([][2]int64, 0)
	row.ParseTo("voters", &voters)

	au := a.GetUserAuth().(*auth.UserAuth)
	vo := vote.NewVoteVO(au.UserId(), row.GetString("title"), row.GetString("descript"), row.GetStringSlice("options"), voters, row.GetTime("begin_at"), row.GetTime("end_at"))

	if id > 0 {
		vo.Id = id
		err = vo.Update()
	} else {
		err = vo.Create()
	}

	if err != nil {
		return false, gos.DoError(err)
	}

	if _, err = event.New(au.CookieLang(), au.UserId(), au.CookieBranchId(), "plugin.vote.view", vo.Id, voters, vo); err != nil {
		return false, gos.DoError(err)
	}

	return true, nil
}

func (a *VoteApi) UserVoteData(args util.MapData) (db.DataRow, error) {
	if !args.IsSet("id") || args.GetInt64("id") == 0 {
		return nil, gos.NewError(0, "wrong parameter value.")
	}
	voteModel := vote.NewVoteModel()
	return voteModel.UserVoteData(args.GetInt64("id"))
}
