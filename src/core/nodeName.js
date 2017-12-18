define( function() {

"use strict";
//判断节点名称是否为指定名称
function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};

return nodeName;

} );
