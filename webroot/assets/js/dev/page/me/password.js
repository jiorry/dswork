define('me.password', ['app', 'ajax', 'util', 'appData'], function(app, ajax, util, appData){
	app.controller('MePasswordCtrl', ['$scope', '$element', function($scope, $element){
	  	$scope.user = appData.user;
	  	$scope.nick = appData.user.nick;
	  	var rsaData,
	  		client = ajax.NewClient("/api/open");

	  	client.send('public.site.Rsakey', null)
			.done(function(result){
				rsaData = result;
			})

		var $errorBox = $element.find('div.error-box');
		function doError(s){
			$errorBox.text(s)
				.removeClass('hidden');
		}

		function clearError(){
			$errorBox.text('').addClass('hidden');
		}
		
		$element.find(':input').keydown(function(){
			clearError();
		})

		$scope.save = function(){
			var nick = $scope.nick,
				oldPassword = $scope.registion.old_password.$viewValue,
				password = $scope.password,
				confirm = $scope.confirm_pwd;

			if(password != confirm){
				doError('两次输入的密码不匹配');
				return
			}
			var cipher = util.cipherString(rsaData, nick, password),
				oldCipher = util.cipherString(rsaData, nick, oldPassword);

			client.send('private.sign.ChangePassword', {cipher : cipher, old : oldCipher})
				.done(function(result){
					window.location.href = "/"

				}).fail(function(jqXHR){
					var err = JSON.parse(jqXHR.responseText)
					doError(err.message);
				})
		}
	}]);

	return {
		title : '修改密码',
		goBackButton : true,
		headerHtml : '',
		i18n : false
	};
})

