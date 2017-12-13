define( [
	"./fnToString"
], function( fnToString ) {
	"use strict";

	return fnToString.call( Object );
} );

//这个过程，实际等效于 ({}).hasOwnProperty.toString.call(Object)
//可以在浏览器中看到返回结果："function Object() { [native code] }"
//这可以当做一个常量，当一个对象为顶层Object对象时（无其他继承），他的构造函数和原生方法 的toString()返回值应该也是该值
