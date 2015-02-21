define('util', [], function(){
	var util = {}

	util.DATE_DAY = 86400000;
	util.DATE_HOUR = 3600000;

	util.setTitle = function (title){
		if(!title){
			title = ''
		}
		$('#gos-headerTitle').text(title);
		document.title = title;
	}

	util.str2date = function (str){
		str = str.replace(/[A-Za-z]/g, ' ').substr(0,19)
	    var d = new Date(Date.parse(str.replace(/-/g, "/")));
	    d.setTime(d.getTime() - d.getTimezoneOffset()*60000)
	    return d;
	}
	
	util.date2str = function(time, ctype){
		switch(typeof(time)){
			case 'number':
				time = new Date(time);
				break;
			case 'string':
				time = this.str2date(time);
				break;
		}

		if(ctype && ctype=='time')
			return time.getFullYear()+'-'+this.lpad(time.getMonth()+1, '0', 2)+'-'+this.lpad(time.getDate(), '0', 2)+' '+this.lpad(time.getHours(), '0', 2)+':'+this.lpad(time.getMinutes(), '0', 2)
		else
	    	return time.getFullYear()+'-'+this.lpad(time.getMonth()+1, '0', 2)+'-'+this.lpad(time.getDate(), '0', 2)
	}

	util.getUrlParameter = function (sParam){
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) 
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) 
	        {
	            return sParameterName[1];
	        }
	    }
	};

	util.aesEncrypto = function(text, ts, key){
		ts = ts.toString()
	    var iv  = CryptoJS.MD5(util.lpad(ts, '0', 16)),
	    	encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv })
	    
		return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
	};
	
	util.aesDecrypto = function(src, ts, key){
		ts = ts.toString()
	    var iv  = CryptoJS.MD5(util.lpad(ts, '0', 16)),
	    	obj = {
				ciphertext: CryptoJS.enc.Base64.parse(src),
				salt: ""
			}
	    	decrypted = CryptoJS.AES.decrypt(obj, key, { iv: iv })
		return decrypted.toString(CryptoJS.enc.Utf8)
	};

	util.lpad = function(str, padString, l) {
	    while (str.toString().length < l)
	        str = padString + str;
	    return str;
	};
	 
	//pads right
	util.rpad = function(str, padString, l) {
	    while (str.toString().length < l)
	        str = str + padString;
	    return str;
	};

    util.objectFind = function(field, value, data){
		if(!data)
			return null;

		var i,len = data.length
		for(i=0;i<len;i++)
			if(data[i] && data[i][field] == value){
				return data[i];
			}
		return null;
	}

	util.objectFindIndex = function(field, value, data){
		if(!data)
			return -1;

		var i,len = data.length
		for(i=0;i<len;i++)
			if(data[i] && data[i][field] == value){
				return i;
			}
		return -1;
	}

    util.setCookie = function (name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*86400000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    };

	util.getCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    util.deleteCookie = function (name) {
        this.SetCookie(name,"",-1);
    };

    util.getNick = function(){
        if(this.currentNick)
            return this.currentNick

        var s = decodeURIComponent(this.getCookie('PUB_gosauth')),
            arr = s.split('|');
            
        if(arr.length>1){
            this.currentNick = arr[0]
        }else{
            this.currentNick = s
        }
        return this.currentNick;
    };

    util.getSecret = function(){
        return decodeURIComponent(this.getCookie('secret'))
    };

	util.scopeFormData = function(s){
		var item, o, oo, data = {};
		for(o in s){
			if(o.charAt(0)=='$') continue;
			
			item = s[o];
			if(!item) continue;

			if(typeof item.$$parentForm != 'undefined' && item.$valid){
				for(oo in item){
					if(oo.charAt(0)=='$') continue;

					if(item[oo] && typeof item[oo].$modelValue != 'undefined')
						data[oo] = item[oo].$modelValue;
					else
						data[oo] = item[oo].$viewValue;
				}
			}
		}
		return data;
	}

	return util;
});



