define(
	'ngStarRating',
	['app'],
	function(app){
    	app.directive('ngStarRating', [function(){
    		return {
		        restrict: 'A',   
		        replace: false,
		        template : '<div class="clear-flat-form form-rating"><a class="fa fa-star default"></a><a class="fa fa-star default"></a><a class="fa fa-star default"></a><a class="fa fa-star default"></a><a class="fa fa-star default"></a><a class="fa fa-star-o"></a></div>',
		        link: function(scope, elem, attr){
		        	elem.on('click', 'a.fa-star', function(){
		        		var $t = $(this), $nth5;
		        		if($t.hasClass('selected')){
		        			$t.removeClass('selected').nextAll().removeClass('selected');
		        			$nth5 = $t.parent().find('a.fa-star:nth-child(5)');
		        			$nth5.nextAll('a.fa-star:not(.selected)').remove();
		        		}else{
		        			$t.addClass('selected').prevAll().addClass('selected')
		        		}
		        		scope.$apply(function(){
		        			scope[attr.ngModel] = elem.find('a.selected').length;
		        		})

		        	}).on('click', 'a.fa-star-o', function(){
		        		var $t = $(this);
		        		$t.before('<a class="fa fa-star default selected">');

		        		scope.$apply(function(){
		        			scope[attr.ngModel] = elem.find('a.selected').length;
		        		})
		        	})

		        	if(!attr.flexible){
		        		elem.find('a.fa-star-o').remove();
		        	}

		        	if(attr.ngModel){
		        		scope[attr.ngModel] = elem.find('a.selected').length;

		        		scope.$watch(attr.ngModel, function(newValue, oldValue){
		        			if(newValue<0)
		        				return;
		        			var i,
		        				$box = elem.children('div.form-rating');

		        			$box.children('a.fa-star').remove();

		        			if(newValue<6){
		        				for(i=4;i>-1;i--){
		        					if(newValue>i)
		        						$box.prepend('<a class="fa fa-star default selected"></a>');
		        					else
		        						$box.prepend('<a class="fa fa-star default"></a>');
		        				}
		        			}else{
		        				for(i=0;i<newValue;i++){
		        					$box.prepend('<a class="fa fa-star default selected"></a>');
		        				}
		        			}
		        		});
		        	}
		        }
		    }
    	}]);  
	}
)