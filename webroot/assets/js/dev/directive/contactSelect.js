define(
	'ngContactSelect',
	['app'],
	function(app){
    	app.directive('ngContactSelect', [function(){
    		return {
		        restrict: 'A',   
		        replace: false,
		        template : '<div class="clearfix"><div class="items"></div><a class="btn btn-primary select-contact btn-flat" href="" open-mode="blank">+ <i class="fa fa-user"></i></a></div>',
		        link: function(scope, elem, attr){
		        	var formName = elem.closest('form[name]');
		        		formName = formName.length==0 ? null : formName.attr('name');

		        	elem.addClass('gos-contact-items');
		        	// attr('href', 'tools.contact?name='+attr.ngContactSelect)
		        	elem.find('a.select-contact')
		        		.attr('href', attr.ngUrl)
		        		.click(function(){
		        			window._gos.currentToolTarget = elem;
		        		});

		        	elem.on('click', 'i.fa-times', function(){
		        		var $t = $(this).parent(), typ = $t.data('type'), id=$t.data('id');
		        		var simpleData = scope[attr.ngModel],
		        			data = elem.data('select-data');

		        		for (var i = simpleData.length - 1; i >= 0; i--) {
		        			if(simpleData[i][0]==typ && simpleData[i][1]==id){
		        				simpleData.splice(i, 1);
		        				data.splice(i, 1);
		        			}
		        		};

		        		elem.data('select-data', data);
		        		$t.remove();

		        		scope.$apply(function(){
				  			scope[attr.ngModel] = simpleData && simpleData.length==0 ? null : simpleData;
		        		})
		        	});

					elem.on('$contactsSelected', function(e, data, simpleData){
						elem.data('select-data', data);
				  		scope.$apply(function(){
				  			scope[attr.ngModel] = simpleData && simpleData.length==0 ? null : simpleData;
				  		});
					})

				  	scope.$watch(attr.ngModel, function(newValue, oldValue){
				  		if(!newValue){
				  			scope[attr.ngModel] = null;
				  			return;
				  		}

						var item,i, html='', data = elem.data('select-data');
						// if select-data is empty and scope value is not empty, reset scope value to null;
						if(!data){
							scope[attr.ngModel] = null;
							return;
						}

				  		for(i=0;i<newValue.length;i++){
				  			item = data[i];
				  			if(!item)
				  				continue;

				  			switch(parseInt(newValue[i][0])){
				  			case 0:
				  				html += '<a class="btn btn-success item" data-id="'+item.id+'" data-type="0"><img class="avatar xsmall" src="/upload/avatar/4.jpg"> '+item.nick+' <i class="fa fa-times"></i></a>';
				  				break;
				  			case 1:
				  				html += '<a class="btn btn-success item" data-id="'+item.id+'" data-type="1"><i class="fa fa-users"></i> '+item.name+' <i class="fa fa-times"></i></a>';
				  				break;
				  			}
				  		}

				  		elem.find('div.items').html(html);
					});
		        }
		    }
    	}]);  
	}
)