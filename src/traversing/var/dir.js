define( [
	"../../core"
], function( jQuery ) {

"use strict";

// 方法属于遍历（dir 在windows操作系统中，是列举出所有同级文件夹的命令）
return function( elem, dir, until ) {
	var matched = [],
		//判断是否有过滤器
		truncate = until !== undefined;

	// nodeType不能为9（Document）
	// 直接使用中括号获取属性 譬如： elem['nextSibling'] 获取下一个兄弟节点
	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			//如果有过滤器，并且目标元素符合过滤器，则不再继续轮询
			//until的含义就是，到此为止，即到符合过滤器的元素为止
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};

} );
