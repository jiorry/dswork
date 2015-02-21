package module

import (
	"../../../model/site/plugin"
	"github.com/kere/gos"
	"github.com/kere/gos/lib/util"
)

type PluginsApi struct {
	gos.WebApi
}

func (a *PluginsApi) MyPlugins() ([][]interface{}, error) {
	userPluginModel := plugin.NewUserPluginModel()
	dataset, err := userPluginModel.MyPlugins(a.GetUserAuth().UserId())
	return dataset.Encode(), err
}

func (a *PluginsApi) Plugins(args util.MapData) (util.MapData, error) {
	cataId := args.GetInt64("catalog_id")
	pluginModel := plugin.NewPluginModel()
	pluginCatalogModel := plugin.NewPluginCatalogModel()

	cata, err := pluginCatalogModel.SubCatalogs(cataId)
	if err != nil {
		return nil, err
	}

	plugins, err := pluginModel.Plugins(cataId)
	if err != nil {
		return nil, err
	}

	obj := util.MapData{}
	obj["catalogs"] = cata.Encode()
	obj["plugins"] = plugins.Encode()

	return obj, nil
}
