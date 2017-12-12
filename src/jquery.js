//js模块加载有amd umd commonjs es6 等等规范
//define函数属于amd规范
//目前比较常用的amd规范引用方式 是使用requirejs
//查看http://requirejs.org
define([ //引入的模块
	"./core",
	"./selector",
	"./traversing",
	"./callbacks",
	"./deferred",
	"./deferred/exceptionHook",
	"./core/ready",
	"./data",
	"./queue",
	"./queue/delay",
	"./attributes",
	"./event",
	"./event/alias",
	"./event/focusin",
	"./manipulation",
	"./manipulation/_evalUrl",
	"./wrap",
	"./css",
	"./css/hiddenVisibleSelectors",
	"./serialize",
	"./ajax",
	"./ajax/xhr",
	"./ajax/script",
	"./ajax/jsonp",
	"./ajax/load",
	"./event/ajax",
	"./effects",
	"./effects/animatedSelector",
	"./offset",
	"./dimensions",
	"./deprecated",
	"./exports/amd",
	"./exports/global"
], function( jQuery ) {
//导出的模块
"use strict";

return jQuery;

} );
