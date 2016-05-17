function Simple () {
	// 构造函数...
}
Simple.prototype = {
	// 给目标对象添加方法(继承)
	extend: function(target,source) {
		for (var key in source) {
			target[key] = source[key];
		};
		return target;
	},
	// 清除字符串前后的空格
	trim: function(str) {
		return str.replace(/^\s+|\s+$/,'');
	}
}
// 实例化对象
var $$ = new Simple();

// 选择器,获取相应的对象
$$.extend($$,{
	// 获取对象元素
	id: function(id) {
		return document.getElementById(id);
	},
	// 改进版
	_tag: function(target,id) {
		// 思路
		// 现获取范围容器
		// 然后再容器中寻找元素集合
		var dom = getDom(id);
		var eles = getElements(dom,target);
		return eles;
		function getDom(id) {
			var dom;
			dom = $$.isString(id)?$$.id(id):id;
			return dom;
		}
		function getElements(cont,tag) {
			var elements;
			// 如果范围容器不为空,即在容器中选择
			if (cont) {
				elements = cont.getElementsByTagName(tag);
			}else {
				elements = document.getElementsByTagName(tag);
			}
			return elements;
		}
	},
	_class: function(classname,context) {
		var elements = [];
		var doms;
		var item = $$.isString(context)?$$.id(context):context;
		return get_Class(classname,item);
		function get_Class(classname,cont) {
			var item;
			if (cont) {
				item = cont;
			}else {
				item = document
			}
			if(document.getElementsByClassName){
				return item.getElementsByClassName(classname);
			}else {
				doms = item.getElementsByTagName('*');
				for (var i = 0; i < doms.length; i++) {
					var arr = doms[i].className.split(' ');
					for (var j = 0; j < arr.length; j++) {
						if (arr[j] == classname) {
							elements.push(doms[i]);
						}
					};
				};
				return elements;
			}
		}
	},
	// 集合选择器,选择传入字符串所包含的所有元素对象
	_group: function (str) {
		// 将传入的str转化为数组
		var items = str.split(',');
		var result = [];
		for (var i = 0; i < items.length; i++) {
			// 截取字符
			var first = items[i].charAt(0);
			var name = items[i].slice(1);
			// 相应的获取元素对象
			if (first == '#') {
				var dom = $$.id(name);
				result.push(dom);
			}else if (first == '.') {
				var list = _class(name);
				for (var j = 0,len = list.length; j < len; j++) {
					result.push(list[j]);
				};
			}else {
				var tags = $tag(items[i]);
				for (var k = 0,len = tags.length; k < len; k++) {
					result.push(tags[k]);
				};
			}
		};
		return result;
	},
	// 层级选择器
	_layer: function(str) {
		var context = [];
		var result = [];
		// 将传入参数转化为数组
		var arr = str.split(' ');
		for (var i = 0; i < arr.length; i++) {
			context = result;
			result = [];
			var item = arr[i];
			var first = item.charAt(0);
			var name = item.slice(1);
			if (first == '#') {
				result.push($$.id(name));
				console.log(result+'----id');
			}else if(first == '.') {
				getClass(name);
				console.log(result+'----class');
			}else {
				getTags(item);
				console.log(result+'----tag');
			}
		}
		function getTags(item) {
			if (context.length) {
				for (var j = 0; j < context.length; j++) {
					var tagDoms = $$._tag(item,context[j]);
					pushArray(tagDoms);
				};
			}else {
				var list = $$._tag(item);
				pushArray(list);
			}
		}
		function getClass(name) {
			if (context.length) {
				for (var i = 0; i < context.length; i++) {
					var classDoms = $$._class(name,context[i]);
					pushArray(classDoms);
				};
			}else {
				var list = _class(name);
				pushArray(list);
			}
		}
		function pushArray(list){
			for (var i = 0; i < list.length; i++) {
				result.push(list[i]);
			};
		}
		return result;
	},
	// 层级+集合选择
	_layerGroup: function(str) {
		// 将传入的str转化为数组
		var items = str.split(',');
		var result = [];
		for (var i = 0; i < items.length; i++) {
			var ele = items[i];
			var cont = $$._layer(ele);
			pushRes(cont);
		};
		function pushRes(list) {
			for (var i = 0; i < list.length; i++) {
				result.push(list[i]);
			};
		}
		return result;
	},
	queryCheck: function(str,cont) {
		cont = cont || document;
		return cont.querySelectorAll(str);
	}
});

//数据类型检测
$$.extend($$,{
	// 判断数据类型
	isNumber: function(ele) {
		return typeof ele === 'number' && isFinite(ele);
	},
	isString: function(ele) {
		return typeof ele === 'string';
	},
	isBoolean: function(ele) {
		return typeof ele === 'boolean';
	},
	isNull: function(ele) {
		return ele === null;
	},
	isUndefined: function(ele) {
		return typeof ele === 'undefined';
	},
	isObj: function(ele) {
		if (ele === null || typeof ele === 'undefined') {
			return false;
		}
		return typeof ele === 'object';
	},
	isArray: function(ele) {
		if (ele === null || typeof ele === 'undefined') {
			return false;
		}
		return ele.constructor === Array;
	}
}); 

// 事件绑定机制
$$.extend($$,{
	// 封装jQuery类似on的方法
	on: function(ele,type,fn) {
		// 判断传入的是否是字符串,否则默认为DOM对象
		var dom = this.isString(ele)?document.getElementById(ele):ele;
		// 判断浏览器是否支持该事件绑定方式
		if (dom.addEventListener) {
			dom.addEventListener(type, fn, false);
		}else{
			// 判断是否支持IE的attachEvent事件绑定方法
			if (dom.attachEvent) {
				dom.attachEvent('on'+type, fn);
			}
		}
	},
	// 解绑事件
	off: function(ele,type,fn) {
		var dom = this.isString(ele)?document.getElementById(ele):ele;
		// 判断浏览器是否支持该事件绑定方式
		if (dom.removeEventListener) {
			dom.removeEventListener(type,fn);
		}else{
			// 判断是否支持IE的attachEvent事件绑定方法
			if (dom.detachEvent) {
				dom.detachEvent('on'+type, fn);
			}
		}
	}
});

// 事件类型
$$.extend($$,{
	// 点击事件
	click: function(id,fn) {
		this.on(id,'click',fn);
	},
	// 鼠标进入事件
	mouseover: function(id,fn) {
		this.on(id,'mouseover',fn);
	},
	// 鼠标移出事件
	mouseout: function(id,fn) {
		this.on(id,'mouseout',fn);
	},
	// hover事件
	hover: function(id,fnIn,fnOut) {
		if (fnIn) {
			this.mouseover(id,fnIn);
		};
		if (fnOut) {
			this.mouseout(id,fnOut);
		};
	}
});

// event事件
$$.extend($$,{
	// 获得event对象
	getEvent: function(e) {
		// 三元表达式
		return e?e:window.event;
		// 短路表达式
		// return e||window.event;
	},
	// 获取event对象的target
	getTarget: function(e) {
		var e = this.getEvent(e);
		return e.target || e.srcElement;
	},
	// 阻止冒泡
	stopBubble: function(e) {
		// 使用短路表达式(短路表达式这样写有问题)
		// return this.getEvent(e).stopPropagation()||(this.getEvent(e).cancelBubble = true);
		var event = this.getEvent(e);
		if (event && event.stopPropagation) {
			// 阻止冒泡,正常浏览器
			event.stopPropagation();
		}
		else {
			// IE浏览器解决冒泡问题
			event.cancelBubble = true;
		}
	},
	// 阻止默认事件
	stopDefault: function(e) {
		// 使用短路表达式
		return $$.getEvent(e).preventDefault()||($$.getEvent(e).returnValue = false);
		// if (this.getEvent(e).preventDefault) {
		// 	this.getEvent(e).preventDefault();
		// }
		// else if (this.getEvent(e).returnValue) {
		// 	this.getEvent(e).returnValue=false;
		// }
	}
});

// 样式
$$.extend($$,{
	// 样式选择器
	_css: function(obj,key,value) {
		var doms = $$.isString(obj)?$$.queryCheck(obj):obj;
		// 如果传入的多个对象或集合
		if (doms.length) {
			if (value) {
				for (var i = 0; i < doms.length; i++) {
					setAttr(doms[i],key,value);
				};
			}else {
				return getAttr(doms[0],key);
			}
		}else {
			if (value) {
				setAttr(doms,key,value);
			}else {
				return getAttr(doms,key);
			}	
		}
		// 获取样式,解决兼容
		function getAttr(obj,attr) {
			if (obj.currentStyle) {
				return obj.currentStyle[attr];
			}
			return window.getComputedStyle(obj, null)[attr];
		}
		// 设置样式
		function setAttr(obj,attr,val) {
			return obj.style[attr] = val;
		}
	},
	// 隐藏和显示
	_hide: function(context) {
		var doms = $$.queryCheck(context);
		for (var i = 0; i < doms.length; i++) {
			doms[i].style.display = 'none';
		};
	},
	_show: function(context) {
		var doms = $$.queryCheck(context);
		for (var i = 0; i < doms.length; i++) {
			doms[i].style.display = 'block';
		};
	},
	//  隐藏和显示的新版本,利用_css
	_hideNew: function(context) {
		$$._css(context,'display','none')
	},
	_showNew: function(context) {
		$$._css(context,'display','block')
	},
	// 属性设置和获取
	_attr: function(context,key,value) {
		var doms = $$.queryCheck(context);
		if (value) {
			for (var i = 0; i < doms.length; i++) {
				doms[i].setAttribute(key, value);
			};
		}else {
			return doms[0].getAttribute(key);
		}
	},
	// 清除属性
	_removeAttr: function(context,key) {
		var doms = $$.queryCheck(context);
		for (var i = 0; i < doms.length; i++) {
			doms[i].removeAttribute(key);
		};
	},
	// 清除多个对象的多个属性
	_removeAttrs: function() {
		// 获取所有的传入的实参arguments
		var list = Array.prototype.slice.call(arguments);
		var context = list[0];
		var names = list.slice(1);
		var doms = $$.queryCheck(context);
		for (var i = 0; i < doms.length; i++) {
			removes(doms[i]);
		};
		function removes(dom) {
			for (var j = 0; j < names.length; j++) {
				dom.removeAttribute(names[j]);
			};
		}
	},
	// 添加class
	_addClass: function(context,classname) {
		var doms = $$.queryCheck(context);
		for (var i = 0; i < doms.length; i++) {
			adds(doms[i]);
		};
		function adds(dom) {
			dom.className += ' ' + classname;
		}
	},
	// 删除class
	_removeClass: function(context,classname) {
		var doms = $$.queryCheck(context);
		var classList = classname.split(' ');
		for (var i = 0; i < doms.length; i++) {
			var name = removes(doms[i]).join(' ');
			doms[i].className = name;
		};
		function removes(dom) {
			var list = dom.className.split(' ');
			for (var k = 0; k < classList.length; k++) {
				for (var j = 0; j < list.length; j++) {
					if (list[j] == classList[k]) {
						list[j] = '';
					}
				}
			}
			return list;
		}
	},
	// 删除类名
	_RemoveClass: function(context,classname) {
		var doms = document.querySelectorAll(context);
		var classList = classname.split(' ');
		for (var i = 0; i < doms.length; i++) {
			var name = removes(doms[i]).join(' ');
			console.log(name);
			doms[i].className = name;
		};
		function removes(dom) {
			var list = dom.className.split(' ');
			for (var k = 0; k < classList.length; k++) {
				var result = [];
				for (var j = 0; j < list.length; j++) {
					if (list[j] != classList[k]) {
						result.push(list[j]);
					}
				}
				list = result;
			}
			return result;
		}
	},
	//如何编写
	removeClassTeacher: function(context,className){
	    /*思路*/
	   /* 第一步：获取所有的元素*/
	    var doms = $$.queryCheck(context)
	   /* 第二步：遍历删除每个元素的class*/
	    for(var i=0;i<doms.length;i++){
	        //删除每个元素的class
	        deleteClassName(doms[i])
	    }
	    function deleteClassName(dom){
	       /* replace:用后面的字符串替换className*/
	        dom.className =  dom.className.replace(className,'')
	    }
	},
	//设置html
	_html: function(context,str){
	    //1.获得所有元素
	    var doms = $$.queryCheck(context);
	    //2.遍历每一个设置html
	    if (str) {
	    	for(var i=0;i<doms.length;i++){
	        	doms[i].innerHTML = str;
	    	}
	    }else {
    		return doms[0].innerHTML;
	    }
	}
});

// 查询字符串
$$.extend($$,{
	// 获取URL查询字符串参数值
	querystring: function() {

	}
});

// 运动框架
function Animate() {
	this.timer;
	this.queen = [];
}
Animate.prototype = {
	// 执行函数
	add: function(dom,json,duration) {
		// 初始化变量
		this.adapterMany(dom,json,duration);
		this.run();
	},
	// 运行函数
	run: function() {
		// 开启定时器,并运行move函数
		this.timer = setInterval(this.loop.bind(this), 12);
	},
	loop: function() {
		for (var i = 0; i < this.queen.length; i++) {
			var obj = this.queen[i];
			this.move(obj);
		}
	},
	move: function(obj) {
		if (obj.tween > 1) {
			console.log('test');
			this.stopTime();
		}else {
			obj.passTime = +new Date();
			obj.tween = this.getTween(obj.startTime,obj.passTime,'easeOutBounce',obj);
			this.setParam(obj.ele,obj.styles,obj);
		}
	},
	// 设置属性
	setParam: function(dom,arr,obj) {
		for (var i = 0; i < arr.length; i++) {
			this.setOneParma(dom,arr[i].parma,obj.tween*arr[i].change,arr[i].startParma);
		}
	},
	// 设置单个属性
	setOneParma: function(dom,key,step,begin) {
		if (key == 'opacity') {
			$$._css(dom,key,step+begin);
		}else {
			$$._css(dom,key,step+begin+'px');
		}
	},
	// 初始化方法

	// 初始化多个变量
	adapterMany: function(dom,json,duration) {
		var adapters = this.adapter(dom,json,duration);
		this.queen.push(adapters);
	},
	// 初始化变量
	adapter: function(dom,json,duration) {
		var obj = {};
		obj.ele = dom;
		obj.startTime = +new Date();
		obj.tween = 0;
		obj.duration = duration;
		obj.styles = this.getStyle(dom,json);
		return obj;
	},
	// 更改传入json的格式,方便使用
	getStyle: function(dom,json) {
		var arr = [];
		for (var key in json) {
			var obj = {};
			obj.parma = key;
			obj.startParma = parseFloat($$._css(dom,key));
			obj.change = parseFloat(json[key] - obj.startParma);
			arr.push(obj);
		}
		return arr;
	},
	// 获得tween,基于时间的变化比例
	getTween: function(begin,end,ease,obj) {
	var eases = {
	    //线性匀速
	    linear:function (t, b, c, d){
	        return (c - b) * (t/ d);
	    },
	    //弹性运动
	    easeOutBounce:function (t, b, c, d) {
	        if ((t/=d) < (1/2.75)) {
	            return c*(7.5625*t*t) + b;
	        } else if (t < (2/2.75)) {
	            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	        } else if (t < (2.5/2.75)) {
	            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	        } else {
	            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	        }
	    },
	    //其他
	    swing: function (t, b, c, d) {
	        return this.easeOutQuad(t, b, c, d);
	    },
	    easeInQuad: function (t, b, c, d) {
	        return c*(t/=d)*t + b;
	    },
	    easeOutQuad: function (t, b, c, d) {
	        return -c *(t/=d)*(t-2) + b;
	    },
	    easeInOutQuad: function (t, b, c, d) {
	        if ((t/=d/2) < 1) return c/2*t*t + b;
	        return -c/2 * ((--t)*(t-2) - 1) + b;
	    },
	    easeInCubic: function (t, b, c, d) {
	        return c*(t/=d)*t*t + b;
	    },
	    easeOutCubic: function (t, b, c, d) {
	        return c*((t=t/d-1)*t*t + 1) + b;
	    },
	    easeInOutCubic: function (t, b, c, d) {
	        if ((t/=d/2) < 1) return c/2*t*t*t + b;
	        return c/2*((t-=2)*t*t + 2) + b;
	    },
	    easeInQuart: function (t, b, c, d) {
	        return c*(t/=d)*t*t*t + b;
	    },
	    easeOutQuart: function (t, b, c, d) {
	        return -c * ((t=t/d-1)*t*t*t - 1) + b;
	    },
	    easeInOutQuart: function (t, b, c, d) {
	        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	        return -c/2 * ((t-=2)*t*t*t - 2) + b;
	    },
	    easeInQuint: function (t, b, c, d) {
	        return c*(t/=d)*t*t*t*t + b;
	    },
	    easeOutQuint: function (t, b, c, d) {
	        return c*((t=t/d-1)*t*t*t*t + 1) + b;
	    },
	    easeInOutQuint: function (t, b, c, d) {
	        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	        return c/2*((t-=2)*t*t*t*t + 2) + b;
	    },
	    easeInSine: function (t, b, c, d) {
	        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	    },
	    easeOutSine: function (t, b, c, d) {
	        return c * Math.sin(t/d * (Math.PI/2)) + b;
	    },
	    easeInOutSine: function (t, b, c, d) {
	        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	    },
	    easeInExpo: function (t, b, c, d) {
	        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	    },
	    easeOutExpo: function (t, b, c, d) {
	        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	    },
	    easeInOutExpo: function (t, b, c, d) {
	        if (t==0) return b;
	        if (t==d) return b+c;
	        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	    },
	    easeInCirc: function (t, b, c, d) {
	        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	    },
	    easeOutCirc: function (t, b, c, d) {
	        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	    },
	    easeInOutCirc: function (t, b, c, d) {
	        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	    },
	    easeInElastic: function (t, b, c, d) {
	        var s=1.70158;var p=0;var a=c;
	        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	        if (a < Math.abs(c)) { a=c; var s=p/4; }
	        else var s = p/(2*Math.PI) * Math.asin (c/a);
	        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	    },
	    easeOutElastic: function (t, b, c, d) {
	        var s=1.70158;var p=0;var a=c;
	        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	        if (a < Math.abs(c)) { a=c; var s=p/4; }
	        else var s = p/(2*Math.PI) * Math.asin (c/a);
	        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	    },
	    easeInOutElastic: function (t, b, c, d) {
	        var s=1.70158;var p=0;var a=c;
	        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
	        if (a < Math.abs(c)) { a=c; var s=p/4; }
	        else var s = p/(2*Math.PI) * Math.asin (c/a);
	        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	    },
	    easeInBack: function (t, b, c, d, s) {
	        if (s == undefined) s = 1.70158;
	        return c*(t/=d)*t*((s+1)*t - s) + b;
	    },
	    easeOutBack: function (t, b, c, d, s) {
	        if (s == undefined) s = 1.70158;
	        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	    },
	    easeInOutBack: function (t, b, c, d, s) {
	        if (s == undefined) s = 1.70158;
	        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	    },
	    easeInBounce: function (t, b, c, d) {
	        return c - this.easeOutBounce (d-t, 0, c, d) + b;
	    },
	    easeInOutBounce: function (t, b, c, d) {
	        if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
	        return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	    }
	};
	var change = end - begin;
	return eases[ease](change,0,1,obj.duration);
	},
	// 结束
	stopTime: function() {
		clearInterval(this.timer);
	}
}
$$.animate = function(dom,json,duration) {
	var animate = new Animate();
	animate.add(dom,json,duration)
}