define( function() {

"use strict";

//返回所有兄弟节点（包括前后，注意原生js分为nextSibling，previousSibling）
//这个方法在traversing.js中被使用，使用方式如下：
//传入的n为elem所在平级的所有节点的第一个节点：即 elem.parent.firstChild
//然后再遍历该第一个节点的所有后续子节点，排除目标节点后，剩余的均为兄弟节点
return function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		// nodetype必须为1 且不是目标元素
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};

} );
