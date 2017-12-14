/* global Symbol */
//顶部这句是eslint的声明
//表示global后面的变量都是全局存在的，eslint可以过滤掉其未定义错误

// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module

define([
	"./var/arr",
	"./var/document",
	"./var/getProto",
	"./var/slice",
	"./var/concat",
	"./var/push",
	"./var/indexOf",
	"./var/class2type",
	"./var/toString",
	"./var/hasOwn",
	"./var/fnToString",
	"./var/ObjectFunctionString",
	"./var/support",
	"./var/isWindow",
	"./core/DOMEval"
], function (arr, document, getProto, slice, concat, push, indexOf,
	class2type, toString, hasOwn, fnToString, ObjectFunctionString,
	support, isWindow, DOMEval) {

	"use strict";

	var
		version = "@VERSION",

		// Define a local copy of jQuery
		jQuery = function (selector, context) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init(selector, context);
		},

		// Support: Android <=4.0 only
		// Make sure we trim BOM and NBSP
		// \uFEFF指的是ES5新增的空白符，字节次序标记字符Byte Order Mark（BOM） 低版本的浏览器中无法过滤
		// ES5之后增加了trim方法
		// \xA0指的是零宽不换行空格Zero Width No-Break Space （NBSP）低版本浏览器无法过滤
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function (all, letter) {
			return letter.toUpperCase();
		};

	//将jQuery的原型赋值给fn属性
	//这里定义的所有方法均在原型，这意味着所有jQuery对象均可以使用
	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		// 记录版本号
		jquery: version,

		//构造函数
		constructor: jQuery,

		// The default length of a jQuery object is 0
		// 增加一个length属性，jQuery就成为了一个类数组对象（likeArray）
		length: 0,

		//将类数组对象转换为数组形式，注意slice的用法
		//常见用法就是[].slice.call(arguments)
		toArray: function () {
			return slice.call(this);
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function (num) {

			// Return all the elements in a clean array
			// 如果不设置num则返回所有元素
			// 这里使用==，不如使用 !!num 来的安全和准确
			if (num == null) {
				return slice.call(this);
			}

			// Return just the one element from the set
			return num < 0 ? this[num + this.length] : this[num];
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function (elems) {

			// Build a new jQuery matched element set
			// 将本身已有的对象，和输入的新对象进行合并
			var ret = jQuery.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			// 将原有对象赋值给新属性，该属性在end方法中有效
			ret.prevObject = this;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		// 遍历jquery自身的所有元素
		each: function (callback) {
			return jQuery.each(this, callback);
		},

		map: function (callback) {
			return this.pushStack(jQuery.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		slice: function () {
			return this.pushStack(slice.apply(this, arguments));
		},

		first: function () {
			return this.eq(0);
		},

		last: function () {
			return this.eq(-1);
		},

		eq: function (i) {
			var len = this.length,
				j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end: function () {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	//公有静态方法
	//扩展jQuery对象
	// 参看文档：接受多个参数参数
	// http://api.jquery.com/jQuery.extend/
	jQuery.extend = jQuery.fn.extend = function () {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {}, //第一个参数可为布尔类型，也可以为目标对象
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		// 如果第一个参数为布尔类型，则为拷贝深度参数赋值
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			// 获取第二个参数，作为目标对象
			target = arguments[i] || {};
			i++; //这里提前自加1，为了后面判断是否为一个参数，只有为第一个参数为布尔值才自加1，**切记**
		}

		// Handle case when target is a string or something (possible in deep copy)
		// 如果获取的输入参数仍不为对象，则赋值为空对象
		if (typeof target !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			//这里如果参数i自加1后等于总长度，则说明第一个参数为布尔值，且第二个参数为输入的对象
			//则扩展的目标为jquery本身
			target = this;
			i--;
		}

		// 后续的其他对象，均为将要扩展进来的对象
		for (; i < length; i++) {

			// Only deal with non-null/undefined values
			// 获取要复制的对象
			if ((options = arguments[i]) != null) {

				// Extend the base object
				// 遍历所有属性
				for (name in options) {
					src = target[name]; //jQuery对象本身的属性
					copy = options[name]; //要复制的属性

					// Prevent never-ending loop
					// 如果两个属性相同 则跳过本次赋值
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					// 是否使用深复制，必须为引用类型时（对象或者数组）
					if (deep && copy && (jQuery.isPlainObject(copy) ||
							(copyIsArray = Array.isArray(copy)))) {

						//这里引入clone对象，是为了深复制，需要逐层将对象的属性复制
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						// 使用迭代，将clone对象完全拷贝过来后，再复制给目标对应的属性
						target[name] = jQuery.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						//非深度拷贝，则直接拷贝引用即可
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

    //这里直接用扩展函数，来扩展jquery的方法
	jQuery.extend({

		// Unique for each copy of jQuery on the page
		// 保证该jquery对象的唯一性，通过在主版本上加上一个随机数，然后通过正则表达式，替换掉非数字部分
		// Math.random: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random
		// String.replace: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

		// Assume jQuery is ready without the ready module
		isReady: true,

		//报错则直接抛出异常
		error: function (msg) {
			throw new Error(msg);
		},

		//空方法，什么都不做
		noop: function () {},

		//判断是否为函数
		isFunction: function (obj) {

			// Support: Chrome <=57, Firefox <=52
			// In some browsers, typeof returns "function" for HTML <object> elements
			// (i.e., `typeof document.createElement( "object" ) === "function"`).
			// We don't want to classify *any* DOM node as a function.
			// 【兼容处理】 IE浏览器下部分节点的类型判断为function，因此要过滤掉这部分
			// nodetype 是节点类型 用来判断节点是哪种类型： https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
			return typeof obj === "function" && typeof obj.nodeType !== "number";
		},

		//判断是否为数值类型
		isNumeric: function (obj) {

			// As of jQuery 3.0, isNumeric is limited to
			// strings and numbers (primitives or objects)
			// that can be coerced to finite numbers (gh-2662)
			// jquery3.0之后，改方法限制在数值和字符串类型中使用
			var type = jQuery.type(obj);
			return (type === "number" || type === "string") &&

				// parseFloat NaNs numeric-cast false positives ("")
				// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
				// subtraction forces infinities to NaN
				// parseFloat 能够有效的解决字符串不符合的问题，如‘abc’,经过parseFloat之后，得到NaN
				// NaN进行加减运算仍得到NaN
				// 通过isNaN方法，做最后的检测，确定不是NaN
				!isNaN(obj - parseFloat(obj));
		},

		//判断是否为简单对象
		//所谓简单对象就是对象层级只有一层的对象
		isPlainObject: function (obj) {
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			// 对象为null或者undefined或者类型字符串不为object，那么拜拜
			if (!obj || toString.call(obj) !== "[object Object]") {
				return false;
			}

			//获得对象原型
			proto = getProto(obj);

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			// 直接翻译了，对于Object.create( null ) 生成的对象，其原型为null，这时候认为是简单对象
			if (!proto) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			// 通过构造函数来判断
			Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
			return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
		},

		isEmptyObject: function (obj) {

			/* eslint-disable no-unused-vars */
			// See https://github.com/eslint/eslint/issues/6125
			var name;
			//遍历对象属性，一旦存在，则不是空对象
			for (name in obj) {
				return false;
			}
			return true;
		},

		//获取对象的类型
		// https://www.jquery123.com/jQuery.type/ 贴个中文网址吧，外网比较慢
		type: function (obj) {
			// 对象为null 直接返回null
			if (obj == null) {
				return obj + "";
			}

			// Support: Android <=2.3 only (functionish RegExp)
			// 低版本的安卓内，正则表达式类型会判断为function
			// 类型在之前已经生成到class2type中，这里根据类型字符串直接映射出类型
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[toString.call(obj)] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		// 这个方法将在DOMEval中解析
		globalEval: function (code) {
			DOMEval(code);
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE <=9 - 11, Edge 12 - 15
		// Microsoft forgot to hump their vendor prefix (#9572)
		// 在js中控制样式时，要将连字符形式，转换为驼峰式，因此要专门做一个驼峰转换形式，并不是一般意义上的驼峰转换
		camelCase: function (string) {
			//对于微软前缀进行修正-ms-替换为ms- 替换后，字符串变为 ms-xxxx-xxxx
			//然后对返回的字符串中对 -x 替换为 -X 这样就完成了驼峰转换
			//这里用到了replace函数的一个特殊回调形式 第一个参数为匹配的字串 第二个参数表示第一个（）部分匹配的字符串
			//参见 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
			return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
		},

		//遍历数组或者对象
		each: function (obj, callback) {
			var length, i = 0;

			//类数组按照数组方式处理
			if (isArrayLike(obj)) {
				length = obj.length;
				for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else {
				//对象则遍历所有属性
				for (i in obj) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android <=4.0 only
		// 快速将其他类型转换为字符串的方法： ''+变量
		// 直接通过replace方法将空格去除
		// 如果用嗅探的方式，其实可以先判断是否存在String.prototype.trim方法
		trim: function (text) {
			return text == null ?
				"" :
				(text + "").replace(rtrim, "");
		},

		// results is for internal usage only
		// 以results为基础，arr为源数据，返回一个数组
		makeArray: function (arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArrayLike(Object(arr))) {
					//是类数组，则进行合并
					jQuery.merge(ret,
						typeof arr === "string" ? [arr] : arr
					);
				} else {
					//不是类数组，则直接作为元素追加到后面
					push.call(ret, arr);
				}
			}

			return ret;
		},

		//判断元素是否在数组中 -1表示不存在
		inArray: function (elem, arr, i) {
			return arr == null ? -1 : indexOf.call(arr, elem, i);
		},

		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		// 合并类数组对象
		merge: function (first, second) {
			var len = +second.length,
				j = 0,
				i = first.length;
			//first从末尾开始追加
			for (; j < len; j++) {
				first[i++] = second[j];
			}

			first.length = i;

			return first;
		},

		//参看文档：https://www.jquery123.com/jQuery.grep/
		//查找满足条件的元素，比较简单直观，不做太多介绍了
		grep: function (elems, callback, invert) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		},

		// arg is for internal usage only
		// 映射操作
		// 需要注意的是，方法返回一个新数组，并非在原数组中操作
		// 另外，即使输入的是对象，返回的也依然是数组
		map: function (elems, callback, arg) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if (isArrayLike(elems)) {
				length = elems.length;
				for (; i < length; i++) {
					value = callback(elems[i], i, arg);
                    //如果返回值为null 则不追加到结果中
					if (value != null) {
						ret.push(value);
					}
				}

				// Go through every key on the object,
			} else {
				for (i in elems) {
					value = callback(elems[i], i, arg);
					//如果返回值为null 则不追加到结果中
					if (value != null) {
						ret.push(value);
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply([], ret);
		},

		// A global GUID counter for objects
		// 一般为了保证某些唯一性要求，都会设计一个guid计数，保证唯一性
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		// 代理函数
		proxy: function (fn, context) {
			var tmp, args, proxy;

			//简单交换
			if (typeof context === "string") {
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if (!jQuery.isFunction(fn)) {
				return undefined;
			}

			// Simulated bind
			// 解析剩余的参数
			args = slice.call(arguments, 2);
			proxy = function () {
				//将上下文设定为指定上下文，如果没有，则绑定调用方（注意this的引用原理，百度一下）
				//将原有方法的剩余参数，和新生成方法的参数，合成一个数组，进行调用
				return fn.apply(context || this, args.concat(slice.call(arguments)));
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			// 保证代理的唯一性
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		// 保留属性，在其他地方会用到
		support: support
	});

	//ES6新特性 迭代器，如果支持es6新特性，将jquery的迭代器设置为数组的迭代器，则jquery就具有可迭代的功能了
	// 如果不是特别明白，需要了解一下ES6的新特性。推荐（http://es6.ruanyifeng.com/#README）
	if (typeof Symbol === "function") {
		jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
	}

	// Populate the class2type map
	// 将转换类型生成并存储在class2type中
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
		function (i, name) {
			class2type["[object " + name + "]"] = name.toLowerCase();
		});

	//注意这是个内部函数，方法不公开
	//判断一个对象是否为类数组
	//类数组的特点是具有length属性且length大于0
	//因为类数组的判断不能百分百准确，因此不公开此方法
	function isArrayLike(obj) {

		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type(obj);

		//函数和window对象均拜拜
		if (jQuery.isFunction(obj) || isWindow(obj)) {
			return false;
		}
		//数组肯定满足
		//长度为1时，则当做含有一个元素的类数组
		//其他情况下，length属性必须为数值类型，且长度大约0，且可以通过索引访问（length-1 是对象的一个属性）
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	}

	return jQuery;
});
