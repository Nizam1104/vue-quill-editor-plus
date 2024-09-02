!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("quill")):"function"==typeof define&&define.amd?define(["quill"],t):"object"==typeof exports?exports.VueQuillEditor=t(require("quill")):e.VueQuillEditor=t(e.Quill)}(this,function(e){return function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=3)}([function(t,n){t.exports=e},function(e,t,n){"use strict";function i(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function i(r,l){try{var o=t[r](l),a=o.value}catch(e){return void n(e)}if(!o.done)return Promise.resolve(a).then(function(e){i("next",e)},function(e){i("throw",e)});e(a)}return i("next")})}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(r),o=window.Quill||l.default,a={theme:"snow",boundary:document.body,modules:{toolbar:[["bold","italic","underline","strike"],["blockquote","code-block"],[{header:1},{header:2}],[{list:"ordered"},{list:"bullet"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{direction:"rtl"}],[{size:["small",!1,"large","huge"]}],[{header:[1,2,3,4,5,6,!1]}],[{color:[]},{background:[]}],[{font:[]}],[{align:[]}],["clean"],["link","image","video"]]},placeholder:"Insert text here ...",readOnly:!1};"function"!=typeof Object.assign&&Object.defineProperty(Object,"assign",{value:function(e,t){if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var n=Object(e),i=1;i<arguments.length;i++){var r=arguments[i];if(null!=r)for(var l in r)Object.prototype.hasOwnProperty.call(r,l)&&(n[l]=r[l])}return n},writable:!0,configurable:!0}),t.default={name:"quill-editor",data:function(){return{_options:{},_content:"",defaultOptions:a}},props:{content:String,value:String,disabled:{type:Boolean,default:!1},options:{type:Object,required:!1,default:function(){return{}}},globalOptions:{type:Object,required:!1,default:function(){return{}}},imageUploader:{type:Function,default:null}},mounted:function(){this.initialize()},beforeDestroy:function(){this.quill&&this.quill.root&&this.quill.root.removeEventListener("paste",this.handlePaste),this.quill=null,delete this.quill},methods:{initialize:function(){var e=this;this.$el&&(this._options=Object.assign({},this.defaultOptions,this.globalOptions,this.options),this.quill=new o(this.$refs.editor,this._options),this.quill.enable(!1),(this.value||this.content)&&this.quill.pasteHTML(this.value||this.content),this.disabled||this.quill.enable(!0),this.quill.on("selection-change",function(t){t?e.$emit("focus",e.quill):e.$emit("blur",e.quill)}),this.quill.on("text-change",function(t,n,i){var r=e.$refs.editor.children[0].innerHTML,l=e.quill,o=e.quill.getText();"<p><br></p>"===r&&(r=""),e._content=r,e.$emit("input",e._content),e.$emit("change",{html:r,text:o,quill:l})}),this.$emit("ready",this.quill),this.addImageHandlers())},addImageHandlers:function(){this.imageUploader&&(this.quill.getModule("toolbar").addHandler("image",this.selectLocalImage),this.quill.root.addEventListener("paste",this.handlePaste),this.quill.root.addEventListener("drop",this.handleDrop),this.quill.root.addEventListener("dragover",this.preventDefault),this.quill.root.addEventListener("dragenter",this.preventDefault))},selectLocalImage:function(){var e=this,t=document.createElement("input");t.setAttribute("type","file"),t.setAttribute("accept","image/*"),t.click(),t.onchange=function(){var n=t.files[0];n&&e.uploadAndInsertImage(n)}},handlePaste:function(e){var t=e.clipboardData;if(t&&t.items)for(var n=t.items,i=0;i<n.length;i++)if(-1!==n[i].type.indexOf("image")){e.preventDefault();var r=n[i].getAsFile();this.uploadAndInsertImage(r);break}},handleDrop:function(e){if(e.preventDefault(),e.dataTransfer&&e.dataTransfer.files){var t=e.dataTransfer.files[0];t&&-1!==t.type.indexOf("image")&&this.uploadAndInsertImage(t)}},preventDefault:function(e){e.preventDefault()},uploadAndInsertImage:function(e){var t=this;return i(regeneratorRuntime.mark(function n(){var i,r,l;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if("function"!=typeof t.imageUploader||null===t.imageUploader){n.next=14;break}return n.prev=1,n.next=4,t.imageUploader(e);case 4:i=n.sent,r=t.quill.getSelection(!0),t.quill.insertEmbed(r.index,"image",i),n.next=12;break;case 9:n.prev=9,n.t0=n.catch(1),console.error("Image upload failed:",n.t0);case 12:n.next=17;break;case 14:l=new FileReader,l.onload=function(e){if(e.target&&e.target.result){var n=e.target.result;t.quill&&t.quill.chain&&t.quill.chain().focus().setImage({src:n}).run()}},l.readAsDataURL(e);case 17:case"end":return n.stop()}},n,t,[[1,9]])}))()}},watch:{content:function(e,t){this.quill&&(e&&e!==this._content?(this._content=e,this.quill.pasteHTML(e)):e||this.quill.setText(""))},value:function(e,t){this.quill&&(e&&e!==this._content?(this._content=e,this.quill.pasteHTML(e)):e||this.quill.setText(""))},disabled:function(e,t){this.quill&&this.quill.enable(!e)}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(1),r=n.n(i);for(var l in i)["default","default"].indexOf(l)<0&&function(e){n.d(t,e,function(){return i[e]})}(l);var o=n(5),a=n(4),u=a(r.a,o.a,!1,null,null,null);t.default=u.exports},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.install=t.quillEditor=t.Quill=void 0;var r=n(0),l=i(r),o=n(2),a=i(o),u=window.Quill||l.default,s=function(e,t){t&&(a.default.props.globalOptions.default=function(){return t}),e.component(a.default.name,a.default)},d={Quill:u,quillEditor:a.default,install:s};t.default=d,t.Quill=u,t.quillEditor=a.default,t.install=s},function(e,t){e.exports=function(e,t,n,i,r,l){var o,a=e=e||{},u=typeof e.default;"object"!==u&&"function"!==u||(o=e,a=e.default);var s="function"==typeof a?a.options:a;t&&(s.render=t.render,s.staticRenderFns=t.staticRenderFns,s._compiled=!0),n&&(s.functional=!0),r&&(s._scopeId=r);var d;if(l?(d=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(l)},s._ssrRegister=d):i&&(d=i),d){var c=s.functional,f=c?s.render:s.beforeCreate;c?(s._injectStyles=d,s.render=function(e,t){return d.call(t),f(e,t)}):s.beforeCreate=f?[].concat(f,d):[d]}return{esModule:o,exports:a,options:s}}},function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"quill-editor"},[e._t("toolbar"),e._v(" "),n("div",{ref:"editor"})],2)},r=[],l={render:i,staticRenderFns:r};t.a=l}])});