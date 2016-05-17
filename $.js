// 获得类名元素对象
function getClassName(classname) {
	if (document.getElementsByClassName) {
		return document.getElementsByClassName(classname);
	}
	// 下面的语句是ie678 执行
	var arr = [];
	var doms = document.getElementsByTagName("*");
	for (var i = 0; i < doms.length; i++) {
		var names = doms[i].className.split(" ");
		for (var j = 0; j < names.length; j++) {
			if (names[j] == classname) {
				arr.push(doms[i]);
			}
		}
	}
	return arr;
}
// 仿$框架
function $ (argument) {
	var firstName = argument.charAt(0);
	var otherName = argument.substr(1);
	switch(firstName){
		case "#":
			return document.getElementById(otherName);
			break;
		case ".":
			return getClassName(otherName);
			break;	
		default:
			return document.getElementsByTagName(argument);
			break;
	}
}