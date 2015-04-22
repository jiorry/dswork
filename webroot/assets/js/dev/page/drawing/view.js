define('drawing.view', ['app', 'ajax', 'util', 'appData'], function(app, ajax, util, appData){

	app.controller('DrawingViewCtrl', ['$scope', '$element', '$location', function($scope, $element, $location){
	  	var formData = {id: 0}

	  	if(!$location.router.search.id){
	  		$('#gos-btnHome').trigger('click');
	  		return;
	  	}
	  	ajax.NewClient("/api/open").send('drawing.app.ItemViewData', {id: $location.router.search.id})
			.done(function(result){
				var project = util.objectFind('id', parseInt(result.project_id), appData.projects);
				result.project_name = project ? project.name: 'not found';

				var subject = util.objectFind('id', parseInt(result.subject_id), appData.subjects);
				result.subject_name = subject ? subject.name: 'not found';
				result.created = util.date2str(result.created, 'time');

				result.xmjl_sign_at_string = util.date2str(result.xmjl_sign_at, 'time');
				result.xmgl_sign_at_string = util.date2str(result.xmgl_sign_at, 'time');
				result.js_sign_at_string = util.date2str(result.js_sign_at, 'time');
				result.sw_sign_at_string = util.date2str(result.sw_sign_at, 'time');
				result.zt_sign_at_string = util.date2str(result.zt_sign_at, 'time');

				result.xmjl_unsign = unsignString(result.xmjl_unsign_json)
				result.xmgl_unsign = unsignString(result.xmgl_unsign_json)
				result.sw_unsign = unsignString(result.sw_unsign_json)
				result.js_unsign = unsignString(result.js_unsign_json)
				result.zt_unsign = unsignString(result.zt_unsign_json)

				result.xmjl_user = util.objectFind('id', result.xmjl_id, appData.all_users)
				result.js_user = util.objectFind('id', result.js_sign_by, appData.all_users)
				result.zt_user = util.objectFind('id', result.zt_sign_by, appData.all_users)
				result.xmgl_user = util.objectFind('id', result.xmgl_sign_by, appData.all_users)
				result.sw_user = util.objectFind('id', result.sw_sign_by, appData.all_users)


				$scope.$apply(function(){
					$scope.formData = result;
					$scope.currentUser = appData.user;
					$scope.isCurrentUser = (appData.user.id == result.user_id);
					$scope.activeData = util.drawingActiveStatus(result, appData);
				})

				app.setTitle('晒图 ' + result.name);

			}).fail(function(jqXHR){
				var err = JSON.parse(jqXHR.responseText)
				alert(err.message);
				$('#gos-btnHome').trigger('click');
			});

		var $dialog = $element.find('#draw-sign-dialog'),
			$btnSign = $dialog.find('button.btn-primary');

		$scope.showDialog = function(typ){
			$scope.currentSignTitle = typTitle(typ);
			$scope.currentType = typ;
			$dialog.find('button.btn-primary').data('typ', typ);
			
			showDialog();
		}

		$btnSign.click(function(){
			var typ = $btnSign.data('typ'),
				day = 0;
			if(typ == 'zt'){
				day = parseInt($dialog.find('select').val());
			}
			$scope.sign($btnSign.data('typ'), true, day).done(function(){
				hideDialog();
			});
		})

		$btnSign.prev().click(function(){
			hideDialog();
		})

		function showDialog(){
			$dialog.css('display', 'block');
			$dialog.addClass('in');
		}

		function hideDialog(){
			$dialog.removeClass('in').one('bsTransitionEnd', function(){
				$dialog.css('display', 'none');
			}).emulateTransitionEnd(150);
		}

		$scope.sign = function(typ, sign, day){
			return ajax.NewClient("/api/open").button($btnSign).send('drawing.app.DoSign', {item_id: $scope.formData.id, sign: sign, typ: typ, day: day})
				.done(function(result){
					if(!result)
						return;

					$scope.$apply(function(){
						$scope.activeData['finish_' + typ] = sign;

						if(sign){
							$scope.formData[typ + '_user'] = appData.user;
							$scope.formData[typ + '_sign_by'] = appData.user.id;
							$scope.formData[typ + '_sign_at_string'] = util.date2str(new Date(), 'time');

						}else{
							$scope.formData[typ + '_user'] = null;
							$scope.formData[typ + '_sign_by'] = 0;
							$scope.formData[typ + '_sign_at_string'] = null;

							$scope.formData[typ + '_unsign'] = util.date2str(new Date(), 'time') + " " + appData.user.nick + " 撤销签字"
						}

					})
				})
		}

		function typTitle(typ){
			switch(typ){
			case 'js':
				return '技术部';
			case 'sw':
				return '商务部';
			case 'xmjl':
				return '项目经理';
			case 'xmgl':
				return '项目管理';
			case 'zt':
				return '制图部';
			}
		}

		function unsignString(s){
			var obj = JSON.parse(s)
			if(!obj || obj.length == 0) return '';

			obj = obj[obj.length-1]

			var u = util.objectFind('id', obj.uid, appData.all_users);
			return util.date2str(obj.time, 'time') + " " + u.nick + " 撤销签字"
		}
	}]);

	return {
		title : '晒图表单',
		goBackButton : true,
		headerHtml : '',
		i18n : false
	};
})

