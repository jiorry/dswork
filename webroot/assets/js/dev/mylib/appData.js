define('appData',['util'],
	function(util) {
		var appData = {
			bindedUser : null,
			user : null,
			all_users : null,
			subjects : [],
			projects : [],
			draw_js_users : [],
			draw_sw_users : [],
			draw_xmgl_users : [],
			draw_xmjl_users : [],
			draw_zt_users : [],
			draw_js_user_ids : [],
			draw_sw_user_ids : [],
			draw_xmgl_user_ids : [],
			draw_xmjl_user_ids : [],
			draw_zt_user_ids : []
		};

		appData.buildData = function(){
			buildUsers('js');
			buildUsers('sw');
			buildUsers('xmjl');
			buildUsers('xmgl');
			buildUsers('zt');
		}

		function buildUsers(typ){
			appData['draw_'+typ+'_users'] = [];
			var item,
				ids = appData['draw_'+typ+'_user_ids'],
				arr = ids.split(',');

			for (var i = arr.length - 1; i >= 0; i--) {
				item = util.objectFind('id', arr[i], appData.all_users);
				if(item)
					appData['draw_'+typ+'_users'].push(item)
			};
		}

		return appData;
	}		
);
