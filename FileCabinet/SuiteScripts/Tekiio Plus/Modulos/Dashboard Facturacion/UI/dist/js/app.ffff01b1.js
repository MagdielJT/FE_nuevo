(function(){"use strict";var __webpack_modules__={389:function(e,t,r){r.d(t,{Z:function(){return u}});var a=function(){var e=this;e._self._c;return e._m(0)},s=[function(){var e=this,t=e._self._c;return t("div",{attrs:{id:"footer-component"}},[t("div",{staticClass:"blue-text"},[t("span",{staticClass:"texto-footer"},[e._v("Powered by ")]),e._v(" "),t("strong",[t("a",{attrs:{href:"https://www.freebug.mx/"}},[e._v(" Freebug")])])])])}],o={name:"FooterFreebugComponent",data(){return{}}},_=o,n=r(1001),i=(0,n.Z)(_,a,s,!1,null,null,null),u=i.exports},5158:function(e,t,r){r.d(t,{Z:function(){return c}});var a=function(){var e=this,t=e._self._c;return t("div",{class:!0===this.$store.state.toggleSideBar?"collapsed":"hide_bar"},e._l(e.menuItemsAr,(function(r){return t("b-row",{key:r.id,staticClass:"mb-2",on:{mouseover:function(t){return e.toggleSubMenu(r)},mouseleave:function(t){return e.toggleSubMenuLeave(r)}}},[t("a",{attrs:{href:r.path}},[t("b-col",{staticClass:"menuItem d-flex align-items-center py-2",attrs:{md:"12"}},[t("span",{staticClass:"mx-3"},[t("font-awesome-icon",{attrs:{icon:"fa-cloud-arrow-up"}})],1),t("span",[e._v(e._s(r.title))])])],1),!0===r.hasChildren&&!0===r.toggled?t("div",e._l(r.children,(function(r){return t("ul",{key:r.id,staticClass:"menuSubItem py-2",staticStyle:{"list-style-type":"none"}},[t("a",{attrs:{href:r.path}},[t("li",[t("span",{staticClass:"mx-3"},[t("font-awesome-icon",{attrs:{icon:r.icon,size:"1x"}})],1),t("span",[e._v(e._s(r.subtitle))])])])])})),0):e._e()])})),1)},s=[];const o=()=>{const e=[{id:1,title:"Carga de CSD",path:"#/carga-csd",icon:"fa-solid fa-bars",hasChildren:!1,toggled:!1}];return e};var _=o,n={name:"SideNavBar",data:function(){return{isToggle:null,menuItemsAr:[]}},mounted(){this.isToggle=this.$store.state.toggleSideBar,console.log("val of store:",this.$store.state.toggleSideBar),this.menuItemsAr=_(),console.log(this.menuItemsAr)},methods:{toggleSubMenu(e){e.toggled=!0},toggleSubMenuLeave(e){e.toggled=!1}}},i=n,u=r(1001),l=(0,u.Z)(i,a,s,!1,null,null,null),c=l.exports},2284:function(e,t,r){r.d(t,{Z:function(){return u}});var a=function(){var e=this,t=e._self._c;return t("div",[t("b-navbar",{attrs:{toggleable:"sm"}},[t("b-navbar-toggle",{attrs:{target:"nav-text-collapse"}}),t("b-navbar-brand",{staticClass:"pl-1"},[t("a",{attrs:{href:"https://www.tekiio.com/es/inicio",target:"_blank"}},[t("img",{attrs:{height:"30px",src:"https://tstdrv2220345.app.netsuite.com/core/media/media.nl?id=19558&c=TSTDRV2220345&h=0S5r7D2KBtFpXWq9jOoqZ20-UCADmgTudPx5xK6G2uqsR-YD",alt:"Logo"}})])]),t("b-collapse",{attrs:{id:"nav-text-collapse","is-nav":""}},[t("b-navbar-nav",[t("b-button",{staticClass:"btn_removeBKColor",on:{click:e.handleToggleSideBar}},[t("font-awesome-icon",{attrs:{icon:"fa-solid fa-bars",size:"1x"}})],1)],1),t("p",{staticClass:"titulo_nav"},[e._v("Dashboard de Facturación")])],1)],1)],1)},s=[],o={name:"TopNavBar",components:{},data:function(){return{}},methods:{handleToggleSideBar(){this.$store.commit("setToggleSideBar",!this.$store.state.toggleSideBar)}}},_=o,n=r(1001),i=(0,n.Z)(_,a,s,!1,null,null,null),u=i.exports},8067:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var _template_SideNavBar_vue__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5158),_template_TopNavBar_vue__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(2284),_FooterFreebug_vue__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(389),axios__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(4161);__webpack_exports__.Z={name:"cargaCSD",components:{SideNavBar:_template_SideNavBar_vue__WEBPACK_IMPORTED_MODULE_0__.Z,TopNavBar:_template_TopNavBar_vue__WEBPACK_IMPORTED_MODULE_1__.Z,FooterFreebugVue:_FooterFreebug_vue__WEBPACK_IMPORTED_MODULE_2__.Z},data(){return{url_service:"",array_subsi:[],url_ns_service:""}},created(){this.getURL(),this.busca_subsi();let e=this.$route.query;console.log("params url",e)},methods:{async getURL(){const e=await this.getExternalURL();console.log("url_ns",e),this.url_service=e,console.log("url_service",this.url_service)},busca_subsi(){let e="Aqui van las subsidiarias para el select";return e},async getExternalURL(){try{let self=this,str_url="",str="";return str+="          var urlMode=null;",str+='require(["N/url"],function(urlMode){',str+="            var url=urlMode.resolveScript({",str+="                scriptId:'customscript_fb_tp_dashboard_service_sl',",str+="                deploymentId:'customdeploy_fb_tp_dashboard_service_sl',",str+="                returnExternalUrl:false,",str+="                params:{action_mode: 'search_subsi'}",str+="            });",str+="            self.getConfigAxios2(url)",str+="        });",eval(str),str_url}catch(err){console.error("Error occurred in getExternalURL",err)}},redirection(){console.log("url_ns_service",this.url_ns_service)},getConfigAxios2(e){this.url_ns_service=e;const t={method:"POST",url:e,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,PUT,POST,OPTIONS","Access-Control-Allow-Headers":"authorization"},body:{action_mode:"search_subsi"}};axios__WEBPACK_IMPORTED_MODULE_3__.Z.post(e,t.data).then((e=>{console.log("RESPONSE on getConfigAxios2: ",e.data),this.array_subsi=e.data.data})).catch((e=>{console.log("Hubo errores getConfigAxios2: ",e)}))}}}},4458:function(e,t,r){var a=r(6369),s=function(){var e=this,t=e._self._c;return t("div",{attrs:{id:"app"}},[t("router-view",[t("DashboardFacturacion")],1)],1)},o=[],_=function(){var e=this,t=e._self._c;return t("div",{attrs:{id:"global"}},[t("div",{staticClass:"topNavBarC"},[t("TopNavBar")],1),t("div",{staticClass:"sideNavBarC"},[t("SideNavBar")],1),t("div",{staticClass:"moduleComponent"},[t("b-card",[t("h1",[e._v("holi")])])],1)])},n=[],i=r(5158),u=r(2284),l={name:"DashboardFacturacion",components:{SideNavBar:i.Z,TopNavBar:u.Z},data(){return{}}},c=l,d=r(1001),p=(0,d.Z)(c,_,n,!1,null,null,null),b=p.exports,v={name:"App",components:{DashboardFacturacion:b}},f=v,m=(0,d.Z)(f,s,o,!1,null,null,null),g=m.exports,h=r(2631),w=function(){var e=this,t=e._self._c;return t("div",{attrs:{id:"global"}},[t("div",{staticClass:"topNavBarC"},[t("TopNavBar")],1),t("div",{staticClass:"sideNavBarC"},[t("SideNavBar")],1),t("div",{staticClass:"moduleComponent"},[t("b-card",[t("form",{attrs:{target:"_self",id:"files-form",action:e.url_ns_service,method:"post",encType:"multipart/form-data"}},[t("h1",{staticClass:"titulo"},[e._v("Carga de CSD")]),t("br"),t("div",{staticClass:"contenedor-principal"},[t("div",[t("span",{staticClass:"etiquetas"},[t("label",[e._v("Subsidiaria ")])]),t("br"),t("select",{attrs:{name:"subsidiaries",id:"subsi"},on:{change:e.busca_subsi}},[t("option",{attrs:{value:"",disabled:"",selected:""}},[e._v(" Selecciona una subsidiaria ")]),e._l(e.array_subsi,(function(r){return t("option",{key:r.id,domProps:{value:r.id}},[e._v(" "+e._s(r.text)+" ")])}))],2),t("br"),t("br")]),t("div",[t("label",[e._v("Archivo .cer ")]),t("br"),t("input",{attrs:{accept:".cer",type:"file",name:"archivo_cer",id:"archivo_cer"}}),t("br"),t("br")]),t("div",[t("label",[e._v("Archivo .key ")]),t("br"),t("input",{attrs:{accept:".key",type:"file",name:"archivo_key",id:"archivo_key"}}),t("br"),t("br")]),t("div",[t("label",{staticClass:"psw-label"},[e._v("Contraseña ")]),t("br"),t("input",{staticClass:"psw-field",attrs:{type:"password",placeholder:"Ingresa tu contraseña",name:"pswd",id:"pswd",required:""}}),t("br"),t("br")]),t("div",[t("span",{staticClass:"button"},[t("input",{staticClass:"btn-enviar",attrs:{type:"submit",name:"submit_button",id:"submit_btn",value:"Enviar"}})])])])])]),t("span",{staticClass:"footer"},[t("FooterFreebugVue")],1)],1)])},C=[],k=r(8067),y=k.Z,S=(0,d.Z)(y,w,C,!1,null,null,null),x=S.exports,B=[{path:"/",component:x},{path:"/carga-csd",component:x},{path:"/carga-csd/:par",component:x}],O=r(3822);a["default"].use(O.ZP);const E=new O.ZP.Store({state:{toggleSideBar:!0,msg_from_ns:"Holis",user_data:{email:"ricardo.lopez@freebug.mx",site_permissions:[2,3,5,1],role:"User",user_name:"Ricardo López Ortiz",company_name:"Austin Infectious Disease Consultants",image_url:"https://7076975-sb1.app.netsuite.com/core/media/media.nl?id=44791&c=7076975_SB1&h=zEVspWXTuIyGt-SkcpdSFYwDMEYbb5k1sCvBXC2H5yhycIXj"}},mutations:{setToggleSideBar(e,t){e.toggleSideBar=t},setUser_data(e,t){e.user_data=t}}});var T=E,q=r(6681),D=r(9425),P=(r(7024),r(3494)),A=r(7749),M=r(8539);a["default"].component("font-awesome-icon",A.GN),P.vI.add(M.xiG,M.wEO),a["default"].use(q.XG7),a["default"].use(D.A7),a["default"].use(h.Z);const I=new h.Z({routes:B});a["default"].config.productionTip=!1,new a["default"]({store:T,render:e=>e(g),router:I}).$mount("#app")}},__webpack_module_cache__={};function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var r=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e].call(r.exports,r,r.exports,__webpack_require__),r.exports}__webpack_require__.m=__webpack_modules__,function(){var e=[];__webpack_require__.O=function(t,r,a,s){if(!r){var o=1/0;for(u=0;u<e.length;u++){r=e[u][0],a=e[u][1],s=e[u][2];for(var _=!0,n=0;n<r.length;n++)(!1&s||o>=s)&&Object.keys(__webpack_require__.O).every((function(e){return __webpack_require__.O[e](r[n])}))?r.splice(n--,1):(_=!1,s<o&&(o=s));if(_){e.splice(u--,1);var i=a();void 0!==i&&(t=i)}}return t}s=s||0;for(var u=e.length;u>0&&e[u-1][2]>s;u--)e[u]=e[u-1];e[u]=[r,a,s]}}(),function(){__webpack_require__.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return __webpack_require__.d(t,{a:t}),t}}(),function(){__webpack_require__.d=function(e,t){for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){__webpack_require__.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){__webpack_require__.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={143:0};__webpack_require__.O.j=function(t){return 0===e[t]};var t=function(t,r){var a,s,o=r[0],_=r[1],n=r[2],i=0;if(o.some((function(t){return 0!==e[t]}))){for(a in _)__webpack_require__.o(_,a)&&(__webpack_require__.m[a]=_[a]);if(n)var u=n(__webpack_require__)}for(t&&t(r);i<o.length;i++)s=o[i],__webpack_require__.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return __webpack_require__.O(u)},r=self["webpackChunkDashboardFacturacion_vue"]=self["webpackChunkDashboardFacturacion_vue"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var __webpack_exports__=__webpack_require__.O(void 0,[998],(function(){return __webpack_require__(4458)}));__webpack_exports__=__webpack_require__.O(__webpack_exports__)})();
//# sourceMappingURL=app.6a4e7217.js.map