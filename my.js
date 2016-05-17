// scroll()的封装
function scroll(){
	if (window.pageYOffset != null) {
		return {
			top: window.pageYOffset,
			left: window.pageXOffset
		}
	}
	else if (document.compatMode === "CSS1Compat") {
		return {
			top: document.documentElement.scrollTop,
			left: document.documentElement.scrollLeft
		}
	}
	return{
		top: document.body.scrollTop,
		left: document.body.scrollLeft
	}
}
// 封装client
function client(){
	if (window.innerWidth != null) { //ie9+版本
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	}
	else if (document.compatMode === "CSS1Compat") {
		// 标准版本
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}
	// 怪异模式
	return {
		width: document.body.clientWidth,
		height: document.body.clientHeight
	}
}
// 封装获得css属性
function getStyle(obj,attr){
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	}
	else{
		return window.getComputedStyle(obj,null)[attr];
	}
}
// 阻止冒泡
function stopBubble(event){
	var event = event || window.event;
	if (event && event.stopPropagation) {
		event.stopPropagation(); //正常浏览器
	}
	else{
		event.cancelBubble = true; //ie浏览器
	}
}
// 选中文本内容
function selectionTxt() {
	if (window.getSelection) {
		return window.getSelection().toString();
	}
	else{
		return document.selection.createRange().text;
	}
}
// extend
function extend(target,source) {
	for(var i in source) {
		target[i] = source[i];
	}
	return target;
}
// trim
function trim(str){
	return str.replace(/^\s+|\s+$/, "");
}
