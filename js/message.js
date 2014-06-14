if( ! window.ct)
	window.ct = {};
(function($){
	var _ct_msg_cfg;
	//弹出框
	ct.alert = function(options){
		options.type = options.type || "confirm";
		return alertPopup(options);
	};
	ct.confirm = function(options){
		options.type = options.type || "alert";
		return confirmPopup(options);
	};
	ct.info = function(options){
		options.type = options.type || "info";
		return info(options);
	};
	var t = ct.message = function(options){
		options.type = options.type || "info";
		options.id = options.id || t.uid();
		var subtype = options.type.split("-")[0];
		switch(subtype){
			case "alert":
				return alertPopup(options);
				break;
			case "confirm":
				return confirmPopup(options);
				break;
			default:
				return info(options);
				break;
		}
	}
	t.seed = (new Date().valueOf());
	t.uid = function(){return t.seed++;};
	t.expire = 4000;
	t.keyboard = true;
	t.position = "top";
	t.pull = {};  //队列
	t.timers = {};
	t.hideAll = function(){
		for (var key in t.pull)
			t.hide(key);
	};
	t.hide = function(id){
		var obj = t.pull[id];
		if( obj && obj.parent() ){
			setTimeout(function(){
				obj.remove();
				obj = null;
			}, 2000);
			obj.addClass("hidden");
			if(t.timers[id])
				clearTimeout(t.timers[id]);
			delete t.pull[id];
		}
	};
	function alertPopup(options){
		return _createBox(options, true, false);
	}
	function confirmPopup(options){
		return _createBox(options, true, true);
	}
	function info(options){
		//没有定义容器
		if( ! t.area){
			t.area = $('<div class="ct_message_area"></div>');
			var pos = t.position;
			t.area.css({pos: 5});
			$("body").append(t.area);
		}
		t.hide(options.id);
		var message = $('<div class="ct_info ct-'+options.type+'"><div>'+options.text+'</div></div>');
		message.click(function(){
			t.hide(options.id);
			options = null;
		});
		pos = options.position || t.position;
		if(pos=="bottom")
			t.area.append(message);
		else
			t.area.prepend(message);
		if(options.expire>0){
			t.timers[options.id] = setTimeout(function(){
				t.hide(options.id);
			}, options.expire);
		}
		t.pull[options.id] = message;
		message = null;
		return options.id;
	}
	function _createBox(options, ok, cancel){
		var box = _createStruct(options, ok, cancel);
		if( ! options.hidden)
			modality(true);
		$("body").append(box);
		var x = options.x || ($("body").width()-box.width())/2;
		var y = options.y || ($("body").height()-box.height())/2;
		box.css({top:y,left:x});
		box[0].focus();
		box.keyup(modal_key);
		return box;
	}
	function _createStruct(options, ok, cancel){
		var box = $('<div class="ct_modal_box ct-'+options.type+'" tabindex="-1"></div>');
		box.attr("ctbox", 1);
		var inner = '';
		if(options.width)
			box.css({width:options.width});
		if(options.height)
			box.css({height:options.height});
		if(options.title)
			inner += '<div class="ct_popup_title">'+options.title+'</div>';
		inner += '<div class="ct_popup_text"><span>'+options.text+'</span></div><div class="ct_popup_controls">';
		if(ok)
			inner += button(options.ok||"OK", true);
		if(cancel)
			inner += button(options.cancel||"Cancel", false);
		inner += '</div>';
		box.append($(inner));
		box.click(function(e){
			var source = e.target || e.srcElement;
			if( ! source.className)
				source = source.parentNode;
			if (source.className == "ct_popup_button"){
				var result = $(source).attr("result");
				result = (result=="true") || (result=="false" ? false:result);
				callback(options, result);
			}
		});
		options.box = box;
		if(ok|cancel)
			_ct_msg_cfg = options;
		return box;
	}
	function callback(options, result){
		var usercallback = options.callback;
		modality(false);
		options.box.remove();
		_ct_msg_cfg = options.box = null;
		if(typeof usercallback == "function")
			usercallback(result);
	}
	function modal_key(e){
		if(_ct_msg_cfg){
			e = e||event;
			if (e.preventDefault)
				e.preventDefault();
			return !(e.cancelBubble = true);
		}
	}
	$(document).keydown(modal_key);
	$(document).keyup(modal_key);
 	function button(text, result){
		return '<div class="ct_popup_button" result="'+result+'"><div>'+text+'</div></div>';
	}
 	//遮罩
 	function modality(mode){
 		if( ! modality.cover){
 			modality.cover = $('<div class="ct_modal_cover"></div>');
 			$("body").append(modality.cover);
 		}
 		var display = mode ? "inline-block" : "none";
 		modality.cover.css({display:display});
 	}
})(jQuery);












