define(
	'ngTags',
	['app'],
	function(app){
    	app.directive('ngTags', [function(){
    		return {
		        restrict: 'A',   
		        replace: false,
		        template : '',
		        link: function(scope, elem, attr){
		        	

		        }
		    }
    	}]);  
	}
)